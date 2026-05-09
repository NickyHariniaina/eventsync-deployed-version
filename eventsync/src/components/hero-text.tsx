"use client"

import { TypeAnimation } from "react-type-animation"

export function HeroText() {
  return (
    <TypeAnimation
      sequence={[
        "Gérez vos événements en temps réel",
        2500,
        "Engagez vos participants",
        2500,
        "Suivez chaque session en direct",
        2500,
        "Centralisez questions et retours",
        2500,
      ]}
      wrapper="span"
      cursor={true}
      repeat={Infinity}
      speed={50}
      deletionSpeed={30}
    />
  )
}
