class UploadedFile {
    constructor(name, extension, MIMEtype, size, downloadDate) {
        this.name = name;
        this.extension = extension;
        this.MIMEtype = MIMEtype;
        this.size = size;
        this.downloadDate = downloadDate;
    }
}
module.exports = UploadedFile;
