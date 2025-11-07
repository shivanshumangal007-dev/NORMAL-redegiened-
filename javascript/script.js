gsap.registerPlugin(ScrollTrigger);

function locomotiveJS(){

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,

    // for tablet smooth
    tablet: { smooth: true },

    // for mobile
    smartphone: { smooth: true },
  });
  locoScroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    // 🧠 ADD THIS PART — detects if transform is used, else use fixed
    pinType: document.querySelector("#main").style.transform
      ? "transform"
      : "fixed",
  });



  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

  ScrollTrigger.refresh();

}
function loadingAnimation() {
  let loadingtimeline = gsap.timeline();

  loadingtimeline
    .from("#page1 .heading h1", {
      y: 600,
      duration: 0.9,
      opacity: 0,
    })
    .from("#page1 nav", {
      opacity: 0,
      duration: 0.5,
    })
    .from("#page1 nav .left h4", {
      y: 10,
      x: 10,
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
    })
    .from("#page1 nav .right h3", {
      opacity: 0,
    });
}

function logoAnimation() {
  // gsap.to("#page1 .heading", {
  //   x: -700,
  //   scale: 0,
  //   y: -500,
  //   duration: 2,
  //   scrollTrigger: {
  //     trigger: "#page2",
  //     markers: true,
  //     // scrub: 1,
  //     end: "top 60%",
  //     // pin: true,
  //   },
  // });
  gsap.to("#page1 .logo", {
    opacity: 1,
    scrollTrigger: {
      trigger: "#page2",
      // markers: true,
      scrub: 1,
      scroller: "#main",
      end: "top 60%",
      // pin: true,
    },
  });
}
locomotiveJS();
loadingAnimation();
logoAnimation();
