import { useEffect } from "react";

const Loader = () => {
  useEffect(() => {
    const animation = {
      easing: {
        linear: function (progress: any) {
          return progress;
        },
        quadratic: function (progress: any) {
          return Math.pow(progress, 2);
        },
        swing: function (progress: any) {
          return 0.5 - Math.cos(progress * Math.PI) / 2;
        },
        circ: function (progress: any) {
          return 1 - Math.sin(Math.acos(progress));
        },
        back: function (progress: any, x: any) {
          return Math.pow(progress, 2) * ((x + 1) * progress - x);
        },
        bounce: function (progress: any) {
          // eslint-disable-next-line no-unused-vars,no-constant-condition
          for (let a = 0, b = 1; 1; a += b, b /= 2) {
            if (progress >= (7 - 4 * a) / 11) {
              return (
                -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2)
              );
            }
          }
        },
        elastic: function (progress: any, x: any) {
          return (
            Math.pow(2, 10 * (progress - 1)) *
            Math.cos(((20 * Math.PI * x) / 3) * progress)
          );
        },
      },
      animate: function (options: any) {
        const start = new Date();
        const id = setInterval(function () {
          const timePassed = +new Date() - +start;
          let progress = timePassed / options.duration;
          if (progress > 1) {
            progress = 1;
          }
          options.progress = progress;
          const delta = options.delta(progress);
          options.step(delta);
          if (progress === 1) {
            clearInterval(id);
          }
        }, options.delay || 10);
      },
      fadeOut: function (element: any, options: any) {
        const to = 1;
        this.animate({
          duration: options.duration,
          delta: function (progress: any) {
            progress = this.progress;
            return animation.easing.swing(progress);
          },
          step: function (delta: any) {
            element.style.opacity = to - delta;
          },
        });
      },
      fadeIn: function (element: any, options: any) {
        const to = 0;
        this.animate({
          duration: options.duration,
          delta: function (progress: any) {
            progress = this.progress;
            return animation.easing.swing(progress);
          },
          step: function (delta: any) {
            element.style.opacity = to + delta;
          },
        });
      },
    };

    const load = document.getElementById("loading");
    setTimeout(() => {
      animation.fadeOut(load, { duration: 20 });
      load?.classList.add("d-block");
    }, 1000);
  });
  return (
    <div id="loading">
      <div id="loading-center"></div>
    </div>
  );
};

export default Loader;
