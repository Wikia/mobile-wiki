if (typeof FastBoot === 'undefined') { export var now = function () {
    return Date.now ? Date.now() : +(new Date());
};
 }