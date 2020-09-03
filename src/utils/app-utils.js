import iconAcl from '../assets/icon-acl.svg'
import iconKernel from '../assets/icon-kernel.svg'
import iconRegistry from '../assets/icon-registry.svg'

export const KNOWN_APPS = new Map([
  [
    '0x3b4bf6bf3ad5000ecf0f989d5befde585c6860fea3e574a4fab4c49d1c177d9c',
    {
      humanName: 'Kernel',
      iconSrc: iconKernel,
    },
  ],
  [
    '0xe3262375f45a6e2026b7e7b18c2b807434f2508fe1a2a3dfb493c7df8f4aad6a',
    {
      humanName: 'ACL',
      iconSrc: iconAcl,
    },
  ],
  [
    '0xddbcfd564f642ab5627cf68b9b7d374fb4f8a36e941a75d89c87998cef03bd61',
    {
      humanName: 'EVM Script Registry',
      iconSrc: iconRegistry,
    },
  ],
])