const curry = (fn) => {
	if (fn.length <= 1) return fn;

	const generator = (args) =>
		(args.length === fn.length ?
			fn(...args) :
			arg => generator([...args, arg]));

	return generator([]);
};


const sum = (a, b, c, d) => a + b + c + d;
const curriedSum = curry(sum);
const res = curriedSum(1)(2)(3)(4)
console.log(res);
