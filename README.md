# netsage-boilerplate-grafana-plugin
A granfana plugin boilerplate for netsage 

# Rename Boilerplate Plugin
1. update `FULL_NAME` and `SHORT_NAME` in `Makefile`
2. run `make name_change`
3. update `PREV_FULL_NAME` and `PREV_SHORT_NAME` in `Makefile` to match current plugin name

# Other Useful Makefile targets
- `build` - runs gulp to build grafana plugin
- `reload` - restarts grafana server to load plugin (needs root/sudo privileges to complete)
- `install` - builds, installs plugin and reloads grafana server

# !! IMPORTANT NOTE !!
Makefile `install` target only tested on Fedora release 25
edit makefile for your system


