import FineUploaderTraditional from 'fine-uploader-wrappers';

const acceptedExtensions = [
	"jpg",
	"jpeg",
	"JPEG",
	"JPG"
]

const acceptedExtensionsDialog = [
	".jpg",
	".jpeg"
]

export const uploader = new FineUploaderTraditional ({
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
			acceptFiles: acceptedExtensionsDialog,
			allowedExtensions: acceptedExtensions
		}
	}
});

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
				acceptFiles: acceptedExtensionsDialog,
				allowedExtensions: acceptedExtensions
			}
		}
	});
}