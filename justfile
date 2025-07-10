build:
    pnpm run build
    pnpm run build:firefox

package: build
    #!/usr/bin/env nu
    let version = (open package.json | get version)

    let packageDir = $".output/packages/($version)"
    mkdir $packageDir

    ouch compress .output/chrome-mv3/* ($packageDir | path join $"read-it-later_($version)_unlisted.chromium.zip")
    ouch compress .output/firefox-mv2/* ($packageDir | path join $"read-it-later_($version)_unlisted.firefox.zip")

    git archive --format tar.gz --output ($packageDir | path join $"read-it-later_($version).tar.gz") $"v($version)"

release version:
    pnpm run release --release-as {{version}}
