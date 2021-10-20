<script>

    //js imports
    import { Link, Router, navigate } from "svelte-navigator";
    //stores
    import { Routes } from "../stores/routes";

    import { fade } from 'svelte/transition';
    import { scale } from 'svelte/transition';
    import { slide } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
    import { elasticOut } from 'svelte/easing';


//     //button
    


	let visible = false;

	function spin(node, { duration }) {
		return {
			duration,
			css: t => {
				const eased = elasticOut(t);

				return `
					transform: scale(${eased}) rotate(${eased * 1080}deg);
					color: hsl(
						${~~(t * 360)},
						${Math.min(100, 1000 - 1000 * t)}%,
						${Math.min(50, 500 - 500 * t)}%
					);`
			}
		};
	}

// let toggleNavStatus = false

// let toggleNav = function() {
// let getDropdown = document.querySelector(".wrapper") 
// let getDropdownUl = document.querySelector(".nav ul")
// let getNavLinks = document.querySelectorAll(".nav ul li a")
// let lineLeft = document.querySelector(".stick-l")
// let lineRight = document.querySelector(".stick-r") 



// if (toggleNavStatus === false) {
//     getDropdown.style.height = "100vh"
//     getDropdownUl.style.visibility = "visible"
//     lineLeft.style.translateX = "5px"

//     let arrayLength = getNavLinks.length
//     for (var i = 0; i < arrayLength; i++) {
//         getNavLinks[i].style.opacity = "1"
//     }
    
//     toggleNavStatus = true
// }
// else {
//     getDropdown.style.height = "0"

//     toggleNavStatus = false
// }
// }
// // var el = document.querySelector('.pulldown-btn');
// // el.onclick = function() {
// //  toggleNav()
// //       }

  </script>
 
{#if visible}   
<div class="wrapper" transition:slide="{{duration: 750, delay: 100, easing: cubicInOut}}">

    <!-- <div class="logo" href="#">
        <a class="letter d">L</a>
        <a class="letter i">U</a>
        <a class="letter k1">C</a>
        <a class="letter b">I</a>
        <a class="letter e">D</a>
        <a class="letter ">_</a>
        <a class="letter bold">G</a>
        <a class="letter bold">R</a>
        <a class="letter bold">A</a>
        <a class="letter bold">P</a>
        <a class="letter bold">H</a>
        <a class="letter bold">I</a>
        <a class="letter bold">C</a>
        <a class="letter bold">S</a>

      </div> -->
      <div class="logo" href="/">
        <a href="/" class="letter let1">I</a>
        <a href="/" class="letter let2">L</a>
        <a href="/" class="letter let3">L</a>
        <a href="/" class="letter let4">U</a>
        <a href="/" class="letter let5">S</a>
        <a href="/" class="letter let6">T</a>
        <a href="/" class="letter let7">R</a>
        <a href="/" class="letter let8">A</a>
        <a href="/" class="letter let9">T</a>
        <a href="/" class="letter let10">I</a>
        <a href="/" class="letter let11">V</a>
        <a href="/" class="letter let12">E</a>
        <a href="/" class="letter dev">.</a>
        <a href="/" class="letter dev">D</a>
        <a href="/" class="letter dev">E</a>
        <a href="/" class="letter dev">V</a>


      </div>
    <div class="nav">
        <Router primary={false}>
        {#each Routes as route}
        <a on:click={() => navigate(route.routeUrl)} href={route.routeUrl}>
            <Link to={route.routeUrl}>
                {route.routeName}
            </Link><br>
        </a>
         {/each}
        </Router>
    </div>
</div>
{/if}
<div class="toggle-wrapper">
    <label>
      <input type="checkbox" class="toggle" id="menu" bind:checked={visible}>
    }
  </label>
  </div>

  <style>
   @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');
*
{

    margin: 0;
    padding: 0;
  }


.toggle-wrapper {
    align-items: center;
    align-self: center;
    height: max-content;
    margin: auto;
    display: grid;
    grid-template-columns: 2em;
    grid-template-rows: max-content;
    
    
}

.toggle {
    display: block;
    font-size: 0.9em;
    text-align: center;
    cursor: pointer;

}



  a {
    color: #ffffff;
    text-decoration: none;
  }

  .wrapper :global(.nav) {
    color: #ffffff;
    text-decoration: none;
  }
  a:hover {
    color: #ffffff50;
  }

.nav a {
    
}

    




.wrapper {
    align-items: center;
    align-self: center;
    height: max-content;
    margin: auto;
    display: grid;
    grid-template-columns: 10em 1fr;
    grid-template-rows: max-content max-content max-content;
    transition: height 1s;
    z-index: 100
}  


.nav {
    text-align: left;
    color: #ffffff;
    text-decoration: none;
    font-size: 1em;
    padding: 0.5em 0 0.5em 0;
    grid-column: 1/2;
    height: max-content;
    width: 9em;
    border-top: solid 2px #ffffff60;
    border-bottom: solid 2px #ffffff60;

  }

  input#menu {
    display: none;
    
  }

  label {
    font-size: 1.5em;
    cursor: pointer;
    transform: rotate(90deg);
  }

  label:hover {
    color: rgb(169, 223, 98);
    transform: rotate(calc(360deg + 90deg)) scale(1.25);
    transition: 0.5s cubic-bezier(0,.51,.17,1); 
    /* animation: bounce 0.5s ease-in-out infinite alternate;  */
}

@keyframes bounce {

    50% {
        transform: scale(1.25) rotate(90deg);
    }
    /* 100% {
        transform: translateX(-2px);
    } */


  }


  .wrapper :global(.menu-item) {
    color: #ffffff;
    font-size: 0.75em;
    text-decoration: none;
  }

  .wrapper :global(.menu-item):hover {
    color: #555555;
    font-size: 0.75em;
    text-decoration: none;
  }



.nav ul li a:hover {
    text-decoration: none;
    background-color: #ffffff25;
}

.wrapper :global(a) {
    
    color:#ffffff;
    text-decoration: none;
    font-size: 0.9em;
}


.nav :global(a:hover) {
    color:#d2e907;
    text-decoration: none;
    font-size: 0.9em;
    animation: sway 1s ease-in-out infinite alternate;
}

@keyframes sway {
    50% {
        transform: translateX(20px);
    }
    /* 100% {
        transform: translateX(-2px);
    } */
}





  input:hover {
    color: #6a721f;
  }


    
  

  .wrapper :global(.logo) {
   font-family: 'carlmarx', monospace;
   font-weight: 700;
    display: flex;
    height: max-content;
    /* font-weight: 800; */
    font-size: 1.85em;
    cursor: pointer;
    grid-column: 1/2;
    transform: rotate(-4deg);
    text-decoration: none;
    transform-origin: center;
    margin-bottom:10px;
}


   

  .tag {
    text-align: right;
    font-size: 0.75em;
    margin-top: -0.5em;
    margin-bottom: 1em;
    color: #ffffff80;
    grid-column: 2/3;
}

.orange {
    color: f69d50;
}

.letter {
    opacity: 1;
    transition: 0.8s cubic-bezier(.08,.82,.17,1);
}
.letter:hover {
    color:#d2e907;
    transform: rotateY(360deg);
   
}

.dev {
    font-weight: 400;
}

.let1 {
    animation: spin1 1s cubic-bezier(0,.51,.17,1) 0.25s 1 ;
    
}
.let2 {
    animation: spin2 1.25s cubic-bezier(0,.51,.17,1) 0.25s 1 ;
    
}

.let3 {
    animation: spin3 1.5s cubic-bezier(0,.51,.17,1) 0.25s 1 ;
    
}
.let4 {
    animation: spin4 1.75s cubic-bezier(0,.51,.17,1) 0.25s 1 ;
}
.let5 {
    animation: spin5 2s cubic-bezier(0,.51,.17,1) 0.25s 1 ;   
}
.let6 {
    animation: spin6 2.25s cubic-bezier(0,.51,.17,1) 0.25s 1 ;
}
.let7 {
    animation: spin6 2.5s cubic-bezier(0,.51,.17,1) 0.25s 1 ;
}
.let8 {
    animation: spin6 2.75s cubic-bezier(0,.51,.17,1) 0.25s 1 ;
}
.let9 {
    animation: spin6 3s cubic-bezier(0,.51,.17,1) 0.25s 1 ;
}
.let10 {
    animation: spin6 3.25s cubic-bezier(0,.51,.17,1) 0.25s 1 ;
}
.let11 {
    animation: spin6 3.5s cubic-bezier(0,.51,.17,1) 0.25s 1 ;
}
.let12 {
    animation: spin6 3.75s cubic-bezier(0,.51,.17,1) 0.25s 1 ;
}
@keyframes spin1 {
    100% {
        transform: rotateY(360deg);
    }
}

@keyframes spin2 {
    100% {
        transform: rotateY(720deg);
    }
}
@keyframes spin3 {
    100% {
        transform: rotateY(1080deg);
    }
}
@keyframes spin4 {
    100% {
        transform: rotateY(1440deg);
    }
}
@keyframes spin5 {
    100% {
        transform: rotateY(1800deg);
    }
}
@keyframes spin6 {
    100% {
        transform: rotateY(2520deg);
    }
}


  </style>
  

