# Quick Media Share
A simple Rust program that allow sharing files via http without setup 

## Usage (WIP)
Host files in current directory (more or less usable right now^^)
```
qms
```
#### frontend
cd ui
npm install
npm run dev

### TODO:
Host files in any directory
```
qms --root path/to/root
```

Specify password for access
```
qms --password somepassword
```

## Plans
- support range request for media streaming
- command line args
- optinal password support
- proper ui using svelte
- file upload support
- endpoint for searching

### maybe
- support for different uis
- multiple users and profiles
- automatic preview files
- config file
- clients for different devices (mobile, tv)
- discovery in network (mDNS?)
