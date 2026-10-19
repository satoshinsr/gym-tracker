/** Coaching cues keyed by Exercise.id. */
export const EXERCISE_CUES: Record<string, string[]> = {
  'push-bench-press': [
    'Retract and depress your shoulder blades; keep them pinned to the bench.',
    'Lower the bar to mid-chest with elbows about 45-70 degrees from your torso.',
    'Drive your feet into the floor and press the bar up and slightly back.',
  ],
  'push-incline-db-press': [
    'Set the bench to 30-45 degrees.',
    'Lower the dumbbells until you feel a stretch across the upper chest.',
    'Press up and slightly inward without clanking the weights.',
  ],
  'push-overhead-press': [
    'Squeeze glutes and brace your abs to avoid leaning back.',
    'Move your head back slightly as the bar passes, then push it through.',
    'Finish with the bar over mid-foot and shoulders shrugged up.',
  ],
  'push-lateral-raise': [
    'Lead with the elbows, not the hands.',
    'Raise to shoulder height with a slight forward lean.',
    'Lower slowly; avoid swinging the torso.',
  ],
  'push-tricep-pushdown': [
    'Pin your elbows to your sides.',
    'Fully extend and squeeze the triceps at the bottom.',
    'Let the handle rise only until your forearms are parallel to the floor.',
  ],
  'push-dips': [
    'Lean slightly forward to bias the chest.',
    'Lower until your upper arms are about parallel to the floor.',
    'Press up without shrugging toward your ears.',
  ],
  'pull-deadlift': [
    'Bar over mid-foot; shins close to the bar.',
    'Brace hard, keep the back flat, and push the floor away.',
    'Lock out with hips and knees together; do not hyperextend.',
  ],
  'pull-pullup': [
    'Start from a full hang with shoulders engaged.',
    'Drive your elbows down toward your hips.',
    'Chin clears the bar; lower under control.',
  ],
  'pull-barbell-row': [
    'Hinge to roughly 45 degrees with a neutral spine.',
    'Pull the bar to your lower ribs, elbows close.',
    'Pause briefly, then lower without letting the back round.',
  ],
  'pull-lat-pulldown': [
    'Lean back slightly and keep the chest tall.',
    'Pull the bar to your upper chest, driving elbows down.',
    'Control the return until your lats are fully stretched.',
  ],
  'pull-face-pull': [
    'Set the rope at upper-chest height or higher.',
    'Pull toward your face, splitting the rope apart.',
    'Squeeze the rear delts with elbows high.',
  ],
  'pull-barbell-curl': [
    'Keep elbows fixed at your sides.',
    'Curl without swinging your hips.',
    'Lower slowly to a full stretch.',
  ],
  'legs-squat': [
    'Brace your core and keep the bar on your upper back.',
    'Sit down and back, knees tracking over toes.',
    'Hit at least parallel depth, then drive up through mid-foot.',
  ],
  'legs-rdl': [
    'Soft knees; push your hips straight back.',
    'Keep the bar close to your legs the whole way.',
    'Stop when you feel a hamstring stretch, then squeeze glutes to stand.',
  ],
  'legs-leg-press': [
    'Feet shoulder-width, mid-platform.',
    'Lower until knees reach about 90 degrees without your lower back lifting.',
    'Press through the whole foot; never lock the knees hard.',
  ],
  'legs-lunge': [
    'Take a long step and keep your torso upright.',
    'Drop the back knee toward the floor.',
    'Push through the front heel to step into the next rep.',
  ],
  'legs-leg-curl': [
    'Align the knee joint with the machine pivot.',
    'Curl smoothly and squeeze at the top.',
    'Return slowly without letting the weight stack crash.',
  ],
  'legs-calf-raise': [
    'Drop to a full stretch at the bottom.',
    'Rise onto the balls of your feet as high as possible.',
    'Pause for a second at the top each rep.',
  ],
  // Push: chest
  'push-incline-bench-press': [
    'Set the bench to about 30 degrees to load the upper chest.',
    'Lower the bar to the upper chest with elbows tucked slightly.',
    'Press up without letting your shoulders roll forward.',
  ],
  'push-decline-bench-press': [
    'Secure your legs and keep your shoulder blades pinned back.',
    'Lower the bar to the lower chest under control.',
    'Press straight up; use a spotter for heavy sets.',
  ],
  'push-db-bench-press': [
    'Start with the dumbbells over your chest and wrists stacked.',
    'Lower until your elbows are just below the bench.',
    'Press up and slightly in, squeezing your chest at the top.',
  ],
  'push-cable-fly-high-low': [
    'Set the pulleys high and take a small step forward.',
    'Sweep the handles down and together in a wide arc with soft elbows.',
    'Squeeze the lower chest, then return slowly.',
  ],
  'push-cable-fly-low-high': [
    'Set the pulleys low and keep your chest tall.',
    'Sweep the handles up and together to chin height.',
    'Keep a slight bend in the elbows throughout.',
  ],
  'push-pec-deck': [
    'Adjust the seat so the handles sit at chest height.',
    'Keep shoulder blades back and bring the pads together.',
    'Pause at the squeeze, then open to a comfortable stretch.',
  ],
  'push-pushups': [
    'Hands just outside shoulder width; body in a straight line.',
    'Lower your chest to the floor with elbows about 45 degrees out.',
    'Press up without sagging at the hips.',
  ],
  // Push: shoulders
  'push-seated-db-press': [
    'Sit tall with your back supported and core braced.',
    'Start at ear level with forearms vertical.',
    'Press overhead until your arms are nearly straight.',
  ],
  'push-arnold-press': [
    'Start with palms facing you at chest height.',
    'Rotate your palms outward as you press overhead.',
    'Reverse the rotation on the way down, slowly.',
  ],
  'push-cable-lateral-raise': [
    'Stand side-on to the cable with the handle in your far hand.',
    'Raise your arm out to shoulder height, leading with the elbow.',
    'Lower slowly to keep tension on the side delt.',
  ],
  'push-machine-lateral-raise': [
    'Set the seat so your elbows line up with the pivot.',
    'Raise the pads to shoulder height without shrugging.',
    'Control the return; avoid dropping the weight.',
  ],
  'push-front-raise': [
    'Raise the dumbbells in front of you to shoulder height.',
    'Keep a slight elbow bend and avoid swinging.',
    'Lower under control.',
  ],
  // Push: triceps
  'push-straight-bar-pushdown': [
    'Pin your elbows to your sides.',
    'Press the bar down until your arms are fully straight.',
    'Let it rise only to about chest height.',
  ],
  'push-skull-crushers': [
    'Lie back with the bar over your forehead, arms vertical.',
    'Bend only at the elbows and lower toward your forehead.',
    'Extend back up without flaring the elbows.',
  ],
  'push-overhead-cable-extension': [
    'Face away from the cable with your elbows pointing forward.',
    'Extend your arms overhead without moving your upper arms.',
    'Feel the stretch of the long head on the way back.',
  ],
  'push-close-grip-bench': [
    'Grip just inside shoulder width; do not go extremely narrow.',
    'Lower to the lower chest with elbows tucked.',
    'Press up, locking out through the triceps.',
  ],
  // Pull: vertical
  'pull-chinup': [
    'Underhand grip about shoulder width.',
    'Pull your chin over the bar, driving elbows down and back.',
    'Lower to a full hang under control.',
  ],
  'pull-close-grip-pulldown': [
    'Lean back slightly and keep your chest up.',
    'Pull the handle to your upper chest, elbows close to your sides.',
    'Let your lats stretch fully at the top.',
  ],
  'pull-straight-arm-pulldown': [
    'Hinge slightly and keep your arms almost straight.',
    'Sweep the bar down to your thighs using your lats.',
    'Return slowly until you feel a lat stretch.',
  ],
  // Pull: horizontal
  'pull-db-row': [
    'Support yourself on a bench with a flat back.',
    'Pull the dumbbell toward your hip, not your shoulder.',
    'Lower fully to stretch the lat.',
  ],
  'pull-seated-cable-row': [
    'Sit tall with a slight lean; do not rock back and forth.',
    'Pull the handle to your lower ribs and squeeze your shoulder blades.',
    'Extend your arms slowly without rounding your back.',
  ],
  'pull-tbar-row': [
    'Keep your chest on the pad so your lower back stays out of it.',
    'Pull your elbows back toward your hips.',
    'Pause briefly and lower with control.',
  ],
  'pull-machine-row': [
    'Adjust the chest pad so your arms can fully extend.',
    'Drive elbows back and squeeze your shoulder blades.',
    'Return slowly to a full stretch.',
  ],
  // Pull: rear delts and traps
  'pull-reverse-pec-deck': [
    'Set the handles level with your shoulders, chest on the pad.',
    'Sweep your arms back in a wide arc with soft elbows.',
    'Squeeze the rear delts and return slowly.',
  ],
  'pull-barbell-shrug': [
    'Hold the bar at your thighs with arms straight.',
    'Shrug straight up toward your ears; do not roll your shoulders.',
    'Hold briefly at the top and lower slowly.',
  ],
  'pull-dumbbell-shrug': [
    'Let the dumbbells hang at your sides.',
    'Lift your shoulders straight up and pause.',
    'Lower under control without swinging.',
  ],
  // Pull: biceps
  'pull-incline-db-curl': [
    'Set the bench to about 60 degrees and let your arms hang back.',
    'Curl without moving your upper arms forward.',
    'Lower fully to stretch the long head.',
  ],
  'pull-hammer-curl': [
    'Hold the dumbbells with a neutral (palms-in) grip.',
    'Curl up keeping your elbows at your sides.',
    'Lower slowly; avoid swinging your torso.',
  ],
  'pull-preacher-curl': [
    'Rest your upper arms flat on the pad.',
    'Curl up smoothly and squeeze at the top.',
    'Lower to near full extension without letting the weight drop.',
  ],
  'pull-cable-curl': [
    'Stand close to the cable with elbows pinned at your sides.',
    'Curl the handle up and squeeze your biceps.',
    'Control the return to keep constant tension.',
  ],
  // Legs
  'legs-front-squat': [
    'Rest the bar on your front delts with elbows high.',
    'Keep your torso upright as you squat down.',
    'Drive up through mid-foot without letting the elbows drop.',
  ],
  'legs-goblet-squat': [
    'Hold one dumbbell at your chest with elbows pointing down.',
    'Squat between your knees, keeping your chest tall.',
    'Stand up by driving through your whole foot.',
  ],
  'legs-hack-squat': [
    'Place your feet shoulder-width on the platform with your back flat on the pad.',
    'Lower until your thighs are at least parallel.',
    'Press up without locking your knees hard.',
  ],
  'legs-leg-extension': [
    'Align your knees with the machine pivot.',
    'Extend until your legs are straight and squeeze your quads.',
    'Lower slowly rather than dropping the weight.',
  ],
  'legs-bulgarian-split-squat': [
    'Put your rear foot on a bench and take a long step forward.',
    'Lower straight down until your front thigh is parallel.',
    'Drive through the front heel to stand.',
  ],
  'legs-step-up': [
    'Place your whole front foot on the box.',
    'Step up using the front leg; avoid pushing off the back foot.',
    'Lower slowly back to the start.',
  ],
  'legs-seated-leg-curl': [
    'Adjust the pad just above your heels and keep your hips back in the seat.',
    'Curl your heels toward your glutes.',
    'Return slowly to a full stretch.',
  ],
  'legs-hip-thrust': [
    'Rest your upper back on a bench with the bar over your hips.',
    'Drive your hips up until your torso is level with the floor.',
    'Squeeze your glutes at the top and keep your chin tucked.',
  ],
  'legs-cable-kickback': [
    'Attach the ankle strap and hold the machine for balance.',
    'Kick straight back, squeezing the glute; keep your back still.',
    'Return slowly without letting the weight rest.',
  ],
  'legs-hip-abduction': [
    'Sit tall with your back against the pad.',
    'Push your knees out against the pads.',
    'Pause briefly and return under control.',
  ],
  'legs-seated-calf-raise': [
    'Position the pad on your lower thighs and lower your heels fully.',
    'Raise up onto the balls of your feet.',
    'Pause at the top, then stretch fully at the bottom.',
  ],
};

export const DEFAULT_CUES = [
  'Warm up with a lighter set first.',
  'Use a full range of motion with controlled tempo.',
  'Stop the set when form breaks down.',
];

export const getCues = (id: string): string[] => EXERCISE_CUES[id] ?? DEFAULT_CUES;
