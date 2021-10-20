//import { routeHooks } from "../interfaces"
import TestScene from '../routes/TestScene.svelte'

import BasicScene from '../routes/FlatEarthEngage.svelte'
import Home from "../routes/Home.svelte"
import Totem from '../routes/Totem.svelte'
import CubeMap from "../routes/CubeMapTemplate.svelte"
import PriceOfPeace from "../routes/PriceOfPeace.svelte"
import CityScape from "../routes/CityScape.svelte"
import NorthcliffHill from "../routes/NorthcliffHill.svelte"
import ElectricAcoustic from "../routes/AcousticElectric.svelte"
import ExhibitionSpace from "../routes/ExhibitionSpace.svelte"
import ImageTest from "../routes/ImageTextureTest.svelte"
import Portal from "../routes/Portal.svelte"
import Playground from "../routes/Playground.svelte"
import Bass from "../routes/Bass.svelte"




//export const Routes: routeHooks[] = [
export const Routes = [
  {
    routeName: "Home",
    routeUrl: "",
    component: CityScape
  },
  {
    routeName: "virtual exhibit",
    routeUrl: "/virtualExhibit",
    component: ExhibitionSpace
  },
  {
    routeName: "Icosahedron",
    routeUrl: "/basicscene",
    component: BasicScene
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
    routeName: "The price of peace",
    routeUrl: "/priceOfPeace",
    component: PriceOfPeace
  },
  {
    routeName: "Electric/Acoustic",
    routeUrl: "/electricacoustic",
    component: ElectricAcoustic
  },
  {
    routeName: "Chromatic",
    routeUrl: "/chromatic",
    component: Bass
  },
  {
    routeName: "portal",
    routeUrl: "/portal",
    component: Portal
  },  
  {
    routeName: "playground",
    routeUrl: "/playground",
    component: Playground
  }

]
