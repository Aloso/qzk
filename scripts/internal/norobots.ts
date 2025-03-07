import * as fs from 'node:fs'

fs.writeFileSync('.svelte-kit/cloudflare/robots.txt', 'User-agent: *\nDisallow: /')
