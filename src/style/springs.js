import { springs as baseSprings } from '@aragon/ui'

export const springs = {
  ...baseSprings,
  gentle: { mass: 1, tension: 200, friction: 20 },
  tight: { mass: 0.6, tension: 500, friction: 40 },
}
