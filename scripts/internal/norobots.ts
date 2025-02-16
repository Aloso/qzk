import * as fs from 'node:fs'

fs.writeFileSync('build/robots.txt', 'User-agent: *\nDisallow: /')
