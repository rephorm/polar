function parse(gcode) {
    
}




/*
https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=823374

Letter Meaning
A A-axis of machine
B B-axis of machine
C C-axis of machine
D tool radius compensation number
F feedrate
G general function (see Table 5)
H tool length offset index
I X-axis offset for arcs
X offset in G87 canned cycle
J Y-axis offset for arcs
Y offset in G87 canned cycle
K Z-axis offset for arcs
Z offset in G87 canned cycle
L number of repetitions in canned cycles
key used with G10
M miscellaneous function (see Table 7)
N line number
P dwell time in canned cycles
dwell time with G4
key used with G10
Q feed increment in G83 canned cycle
R arc radius
canned cycle plane
S spindle speed
T tool selection
X X-axis of machine
Y Y-axis of machine
Z Z-axis of machine
Table 3. Word-starting Letters


G Code Meaning
G0 rapid positioning
G1 linear interpolation
G2 circular/helical interpolation (clockwise)
G3 circular/helical interpolation (counterclockwise)
G4 dwell
G10 coordinate system origin setting
G17 XY-plane selection
G18 XZ-plane selection
G19 YZ-plane selection
G20 inch system selection
G21 millimeter system selection
G28 return to home
G30 return to secondary home
G38.2 straight probe
G40 cancel cutter radius compensation
G41 start cutter radius compensation left
G42 start cutter radius compensation right
G43 tool length offset (plus)
G49 cancel tool length offset
G53 motion in machine coordinate system
G54 use preset work coordinate system 1
G55 use preset work coordinate system 2
G56 use preset work coordinate system 3
G57 use preset work coordinate system 4
G58 use preset work coordinate system 5
G59 use preset work coordinate system 6
G59.1 use preset work coordinate system 7
G59.2 use preset work coordinate system 8
G59.3 use preset work coordinate system 9
G61 set path control mode: exact path
G61.1 set path control mode: exact stop
G64 set path control mode: continuous
G80 cancel motion mode (including any canned cycle)
G81 canned cycle: drilling
G82 canned cycle: drilling with dwell
G83 canned cycle: peck drilling
G84 canned cycle: right hand tapping
G85 canned cycle: boring, no dwell, feed out
G86 canned cycle: boring, spindle stop, rapid out
G87 canned cycle: back boring
G88 canned cycle: boring, spindle stop, manual out
G89 canned cycle: boring, dwell, feed out
G90 absolute distance mode
G91 incremental distance mode
G92 offset coordinate systems and set parameters
G92.1 cancel offset coordinate systems and set parameters to zero
G92.2 cancel offset coordinate systems but do not reset parameters
G92.3 apply parameters to offset coordinate systems
G93 inverse time feed rate mode
G94 units per minute feed rate mode
G98 initial level return in canned cycles
G99 R-point level return in canned cycles
Table 5. G Codes


M Code Meaning
M0 program stop
M1 optional program stop
M2 program end
M3 turn spindle clockwise
M4 turn spindle counterclockwise
M5 stop spindle turning
M6 tool change
M7 mist coolant on
M8 flood coolant on
M9 mist and flood coolant off
M30 program end, pallet shuttle, and reset
M48 enable speed and feed overrides
M49 disable speed and feed overrides
M60 pallet shuttle and program stop
Table 7. M Codes
*/