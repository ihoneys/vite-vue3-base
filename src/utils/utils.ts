// 工具方法

export function debounce(fn: any, delay = 200) {
    let timer: any;
    return function () {
        clearTimeout(timer);
        // @ts-ignore
        const context = this;
        const args = arguments;
        timer = setTimeout(function () {
            fn.call(context, args);
        }, delay);
    };
}