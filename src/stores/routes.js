//import { routeHooks } from "../interfaces"

import Totem from '../routes/Totem.svelte'
import NorthcliffHill from "../routes/NorthcliffHill.svelte"
import Portal from "../routes/Portal.svelte"
import Playground from "../routes/Playground.svelte"
import BasicScene from "../routes/BasicScene.svelte"




//export const Routes: routeHooks[] = [
export const Routes = [
  {
    routeName: "Playground",
    routeUrl: "",
    component: Playground
  },
  {
    routeName: "Totem",
    routeUrl: "/totem",
    component: Totem
  },
  {
    routeName: "Joburg",
    routeUrl: "/joburg",
    component: NorthcliffHill
  },
  {
    routeName: "portal",
    routeUrl: "/portal",
    component: Portal
  },
  {
    routeName: "THREEx test",
    routeUrl: "/threex",
    component: BasicScene
  }

]
