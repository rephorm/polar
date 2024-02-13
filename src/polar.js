import Interpreter from 'gcode-interpreter'

class Plotter {
    /** @type{HTMLCanvasElement} */
    canvas;
    /** @type{CanvasRenderingContext2D} */
    ctx;

    x;
    y;

    uvel = 0;
    vvel = 0;

    machineWidth = 100;
    u = 75;
    v = 75;

    penDown = true;

    commandQueue = [];

    running = false;

    ppi = 1;
    feedRateScale = 1.0;

    constructor(canvasId, machineWidth) {
        this.canvas = document.getElementById(canvasId)
        this.ctx = this.canvas.getContext('2d')

        this.plot = document.createElement('canvas');
        this.plot.width = this.canvas.width;
        this.plot.height = this.canvas.height;
        this.plotCtx = this.plot.getContext('2d');

        this.machineWidth = machineWidth;
        this.u = this.machineWidth / 2.0 + 10;
        this.v = this.u;

        this.physdt = 1000.0 / 60.0;
        this.lastT = performance.now()
    }

    plotLine(x1,y1,x2,y2) {
        var ctx = this.plotCtx;
       
        ctx.beginPath()
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.strokeStyle = 'red'; // huh?
        ctx.stroke();
    }

    draw() {
        var ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        ctx.drawImage(this.plot, 0, 0);

        ctx.strokeStyle = 'green';
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(this.x,this.y);
        ctx.lineTo(this.machineWidth, 0);
        ctx.stroke();

        ctx.fillStyle = 'green';
        ctx.fillRect(this.x-2, this.y-2, 4, 4);

        ctx.fillText("(u, v) = (" + Math.round(this.u) + ", " + Math.round(this.v) + ")", 170, 20)
        ctx.fillText("(x, y) = (" + Math.round(this.x) + ", " + Math.round(this.y) + ")", 170, 40)
    }

    process(t) {
        var dt = t - this.lastT;

        if (dt > 5*this.physdt) {
            // Assume the page was off-screen.
            // Skip and start again on next frame.
            // Alternatively, move 
            this.lastT = t;
            return;
        }
        this.plotCtx.beginPath();
        this.plotCtx.moveTo(this.x, this.y);
        while (dt > 0) {
            var step = Math.min(dt, this.physdt);
            this.processPhysics(step);
            this.processCommand(t);
            dt -= step;
        }
        this.plotCtx.stroke();

        

        this.draw();
        this.lastT = t;
    }

    /*
          x
        +----|---------+
        |\           _/
        | \ u      _/
      y |  \     _/   v
        |   \  _/
        |    \/
         
        u^2 = x^2 + y^2
        v^2 = (W - x)^2 + y^2 = x^2 + y^2 + W^2 - 2Wx

        v^2 - u^2 = W^2 - 2Wx
        x = (W^2 - v^2 + u^2)/2W
        y = sqrt(u^2 - x^2)
        */
    uv2xy(u, v) {
        var m = this.machineWidth;
        var x = (m*m + u*u - v*v) / (2*m);
        return {
            x: x,
            y: Math.sqrt(u*u - x*x),
        }
    }

    xy2uv(x,y) {
        var m = this.machineWidth;
        return {
            u: Math.sqrt(x*x + y*y),
            v: Math.sqrt((m-x)*(m-x) + y*y),
        }
    }
    
    processPhysics(dt) {
        this.u += this.uvel * dt;
        this.v += this.vvel * dt;

        // TODO: Check constraints for physicality.

        this.x = (this.machineWidth * this.machineWidth + this.u*this.u - this.v*this.v) / (2 * this.machineWidth);
        this.y = Math.sqrt(this.u * this.u - this.x * this.x)
        //console.log(this.machineWidth, this.x, this.y)
        if (this.penDown) {
            this.plotCtx.lineTo(this.x, this.y)
        } else {
            this.plotCtx.moveTo(this.x, this.y)
        }
    }

    processCommand(t) {
        if (this.commandQueue.length == 0) {
            return;
        }
        var cmd = this.commandQueue.shift()
        var cmds = cmd.process(this, t);
        this.commandQueue = cmds.concat(this.commandQueue);
    }

    run() {
        var self = this;
        this.running = true;
        window.requestAnimationFrame(function frame(t) {
            self.process(t)
            if (self.running) {
                window.requestAnimationFrame(frame);
            }
        })
    }

    stop() {
        this.running = false;
    }
    
    enqueueCommand(cmd) {
        this.commandQueue.push(cmd)
    }

    reset() {
        this.commandQueue = []
        this.u = this.v = this.machineWidth / 2.0 + 10;
        this.uvel = this.vvel = 0;
        this.penDown = false;
        this.plotCtx.clearRect(0, 0, this.plot.width, this.plot.height)
    }
}

// Move from current position to provided polar coordinates over some duration.
// Controls the plotters 'motors' (uvel, vvel) and waits for the duration.
class MoveCommand {
    constructor(u, v, duration) {
        this.u = u
        this.v = v
        this.duration = duration
        this.started = false
    }

    // Process handles the command and returns a list of commands that replace it.
    process(plotter, t) {
        if (!this.started) {
            this.deadline = t + this.duration
            plotter.uvel = (this.u - plotter.u) / this.duration
            plotter.vvel = (this.v - plotter.v) / this.duration
            this.started = true
        } else {
            if (t >= this.deadline) {
                plotter.uvel = 0;
                plotter.vvel = 0;
                return [];
            } else {
                // Adjust for drift
                plotter.uvel = (this.u - plotter.u) / (this.deadline - t)
                plotter.vvel = (this.v - plotter.v) / (this.deadline - t)
            }
        }
        return [this];
    }
}

// Maximum distance to move in one arc
var maxMove = 5;

// Move from current position to provided cartesian position over some duration.
// This simply replaces itself by a series of polar moves small enough to have negligible arcs.
class CMoveCommandPieceWise {
    defaultSpeed = 0.2 // pixels per ms

    constructor(x, y, speed) {
        this.x = x
        this.y = y
        this.speed = speed || this.defaultSpeed
    }

    process(plotter, t) {
        var dx = this.x - plotter.x;
        var dy = this.y - plotter.y;

        var dist = Math.sqrt(dx*dx+dy*dy)
        var duration = dist / this.speed
        var delta = Math.sqrt(dx*dx+dy*dy);
        var steps = Math.ceil(delta / maxMove);
        var cmds = []
        for (var i = 1; i <= steps; i++) {
            var x = plotter.x + i * dx / steps
            var y = plotter.y + i * dy / steps
            var uv = plotter.xy2uv(x, y);
            cmds.push(new MoveCommand(uv.u, uv.v, duration / steps));
        }
        return cmds;
    }
}


class CMoveCommand {
    defaultSpeed = 0.2

    constructor(x, y, speed, absolute) {
        this.x = x
        this.y = y
        this.speed = speed || this.defaultSpeed
        this.absolute = absolute
        this.started = false
    }

    process(plotter, t) {
        if (!this.started) {
            // Convert to absolute coords and handle scaling.
            if (this.absolute) {
                this.x = (this.x * plotter.ppi) || plotter.x
                this.y = (this.y * plotter.ppi) || plotter.y
            } else {
                this.x = plotter.x + ((this.x * plotter.ppi) || 0)
                this.y = plotter.y + ((this.y * plotter.ppi) || 0)
            }
        }

        var dx = this.x - plotter.x
        var dy = this.y - plotter.y
        var dist = Math.sqrt(dx*dx + dy*dy)

        if (!this.started) {
            this.started = true
            this.deadline = t + (dist / this.speed)
        }
        if (t >= this.deadline) {
            plotter.uvel = 0
            plotter.vvel = 0
            return []
        }

        /*
            Coord transform (Jacobian matrix):

            u^2 = x^2 + y^2
            v^2 = (W - x)^2 + y^2 = x^2 + y^2 + W^2 - 2Wx

            2 u du = 2x dx + 2 y dy
            du = (x/u)dx + (y/u)dy
            
            2 v dv = 2(x-W) dx + 2y dy
            dv = ((x-W)/v)dx + (y/v)dy
        */
        var du = dx * plotter.x / plotter.u + dy * plotter.y / plotter.u
        var dv = dx * (plotter.x - plotter.machineWidth)/plotter.v + dy * plotter.y / plotter.v
        
        plotter.uvel = this.speed * du / dist
        plotter.vvel = this.speed * dv / dist
        return [this]
    }
}

class PenCommand {
    constructor(penDown) {
        this.penDown = penDown
    }

    process(plotter, t) {
        plotter.penDown = this.penDown
        return []
    }
}

function makeInterpreter(plotter) {
    var absolute = true

    const handlers = {
        'G0': (params) => {
            plotter.enqueueCommand(new PenCommand(false))
            plotter.enqueueCommand(new CMoveCommand(params.X, params.Y, 0, absolute))
        },
        'G1': (params) => {
            plotter.enqueueCommand(new PenCommand(true))
            plotter.enqueueCommand(new CMoveCommand(params.X, params.Y, params.F/60000.0*plotter.feedRateScale, absolute))
        },
        'G90': (params) => {
            absolute = true;
        },
        'G91': (params) => {
            absolute = false;
        }
    }
    var gi = new Interpreter({
        handlers: handlers,
        defaultHandler: (cmd, params) => {
            console.log("Unhandled command", cmd, params)
        }
    })
    return gi;
}

// Main entry point.
window.addEventListener('load', function() {
    var p = new Plotter('canvas', 400);
    var interp = makeInterpreter(p)
    p.run();

    document.getElementById('submit-gcode').addEventListener('click', (ev) => {
        var gcode = document.getElementById('gcode').value
        //var maxArcStep = parseFloat(document.getElementById('max-arc-step').value) || 5
        var feedRateScale = parseFloat(document.getElementById('feed-rate-scale').value) || 20
        var ppi = parseFloat(document.getElementById('pixels-per-inch').value) || 1
        
        plotter.ppi = ppi
        plotter.feedRateScale = feedRateScale
        interp.loadFromString(gcode, (err, results) => {
            if (err) {
                console.error(err);
                return;
            }
        })
        .on('data', (data) => {
        })
        .on('end', (results) => {
        })
    });

    document.getElementById('reset').addEventListener('click', (ev) => {
        p.reset()
    });

    // for debugging / interactivity
    window.plotter = p
})