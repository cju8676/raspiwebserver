// Contains helper functions for File Upload page

// takes in Array of Files
// returns Array of Files
// that are supported by the application
export const filterUnsupportedFiles = (filesArray) => {
    const supported = ["jpeg", "jpg", "jfif", "gif", "mp4", "mov"]
    return filesArray.filter(file =>
        supported.includes(
            file.name
                .split('.')
                .pop()
                .toLowerCase())
    )
}

// parse webkitRelativePath up to
// the last forward slash and return that
const getFolder = (path) => {
    return path.substring(0, path.lastIndexOf('/'))
}

function convertToMP4(movPath, filename) {
    return fetch('/convertToMP4/' + movPath + '/' + filename)
        .then(response => {
            const data = response.blob()
            return data
        })
}

// parse through each folder looking for Live Photos
// being a MOV and JPG of the same name
// return converted filesArray
// { name: "", files: [File, File]} ==> {name: "", files: [{LivePhoto}, File, etc.]}
export async function extractLivePhotos(sorted) {
    var extracted = [];
    var folders = [...sorted];
    // go through each object's files array
    while (folders.length !== 0) {
        const o = folders.pop()
        console.log("o here", o)
        var newFiles = [];
        const dupFileNames = duplicates(count(getFilenames([...o.files])))
        // for each duplicate filename, create live photo obj and push to newFiles
        if (dupFileNames.length) {
            for (let i = 0; i < dupFileNames.length; i++) {
                const movFile = o.files.find(item => item.name === `${dupFileNames[i]}.mov`)
                const jpgFile = o.files.find(item => item.name === `${dupFileNames[i]}.jpg`)
                var vidURL;
                await convertToMP4(o.name, dupFileNames[i]).then((data) => {
                    vidURL = URL.createObjectURL(data)
                });
                newFiles.push({
                    oldMOV: URL.createObjectURL(movFile),
                    // vid: mp4URL,
                    vid: vidURL,
                    img: URL.createObjectURL(jpgFile)
                })
                // remove from old
                o.files = [...o.files].filter(s => !s.name.includes(dupFileNames[i]))
            }
        }
        // push remaining non live to newFiles
        o.files.forEach(file => newFiles.push(file))

        extracted.push({
            name: o.name,
            files: newFiles
        })
    }
    return extracted;
}

// takes in Array of Files
// returns folders will include
// array of objects containing Files 
// and Live photos sorted by folder
// { name: "", files: [File, {LivePhoto}, ..., File] }
export const sortBulkUpload = (filesArray) => {
    if (filesArray.length === 0) return;
    var sorted = [];
    var files = [...filesArray];
    // iterate through files adding each of its respective object's array
    while (files.length !== 0) {
        const f = files.pop()
        // get folder name
        const folder = getFolder(f.webkitRelativePath)
        // we have not seen this folder name yet, add it and push
        if (!sorted.some(f => f.name === folder)) {
            sorted.push({ name: folder, files: [f] })
        }
        // we have seen this folder name - add it to its respective object's array
        else {
            sorted.find(f => f.name === folder).files.push(f)
        }
    }
    console.log("SORTED", sorted)
    return sorted
}

// get all non-unique file names in array of filenames
// count accumulates an object of names to their count in given array
export const count = names =>
    names.reduce((result, value) => ({
        ...result,
        [value]: (result[value] || 0) + 1
    }), {}); // don't forget to initialize the accumulator

// duplicates takes in the accumulated object to 
// return an array of which values are duplicates
export const duplicates = dict =>
    Object.keys(dict).filter((a) => dict[a] > 1);

// get file names from filesArray
// and truncate file extension
export const getFilenames = (filesArray) =>
    filesArray.map(i => i.name.replace(/\.[^/.]+$/, ""))
