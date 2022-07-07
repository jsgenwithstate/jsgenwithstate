
/**
 * Wrapper to create one-param generator around a two param generator,
 * where the second param is set to a new 'state' property of the generator.
 * @param {(input: any, state: {}) => any} generatorWithStateInjected
 */
export function generatorWithNewState(generatorWithStateInjected) {
  return (/** @type {any} */ input) => {
    const state = {};
    const gen = generatorWithStateInjected(input, state);
    gen.state = state;
    return gen;
  };
}

/*
Generator persistence support. Allows the generator to fast-forward on load,
to the persisted value of state.ctr

At start:
initStateOnLoad(state)

Around each yield:
yield* yieldIfNeeded(state,blahblahblah)

*/

export function initStateOnLoad(state) {
	if(state.targetCtr == null || 
	state.targetCtr < state.ctr) {
		state.targetCtr = state.ctr
	} 
	state.ctr = 0
}

export function* yieldIfNeeded(state,val) {
	state.ctr++
	if(state.targetCtr == null ||
		state.ctr > state.targetCtr 
	) {
		yield val
	}
}
