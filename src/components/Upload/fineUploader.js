import FineUploaderTraditional from 'fine-uploader-wrappers';

const acceptedExtensions = [
	"jpg",
	"jpeg",
	"JPEG",
	"JPG"
]

export const getUploader = (limit = 0) =>
{
	return new FineUploaderTraditional ({
		options: {
			autoUpload: false,
			disableCancelForFormUploads: true,
			chunking: {
				enabled: true
			},
			deleteFile: {
				enabled: false,
			},
			retry: {
				enableAuto: false
			},
			resume: {
				enabled: false
			},
			validation: {
				itemLimit: limit,
				allowedExtensions: acceptedExtensions
			}
		}
	});
}