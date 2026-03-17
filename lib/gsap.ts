
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);


  gsap.config({
    nullTargetWarn: false, 
    autoSleep: 60,         
    force3D: true,        
  });

  
  gsap.defaults({
    ease: "power3.out",
    duration: 0.8,
  });
}

export { ScrollTrigger };
export default gsap;
