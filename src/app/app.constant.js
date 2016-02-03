(function () {
	'use strict';

	angular
		.module('procultApp')
		.constant('API_URI_PREFIX', 'http://localhost:8000/api/v1')
		.constant('PROPOSAL_LIMIT', 2)
		.constant('ACCEPTED_FORMAT_UPLOADS', [
			'application/pdf',
			'application/msword',
			'application/excel',
			'application/x-excel',
			'application/vnd.ms-excel',
			'application/x-msexcel',
			'application/powerpoint',
			'application/mspowerpoint',
			'application/x-mspowerpoint',
			'application/vnd.ms-powerpoint',
			'application/vnd.oasis.opendocument.text',
			'application/vnd.oasis.opendocument.presentation',
			'application/vnd.oasis.opendocument.spreadsheet',
			'image/png',
			'image/gif',
			'image/jpg',
			'image/jpeg',
			'image/pjpeg',
			'image/tiff',
			'image/x-tiff',
			'image/bmp',
			'image/x-windows-bmp',
			'audio/mpeg3',
			'audio/x-mpeg-3',
			'audio/voc',
			'audio/wav',
			'audio/x-wav',
			'audio/aiff',
			'audio/x-aiff',
			'audio/midi',
			'audio/x-mid',
			'audio/x-midi',
			'video/mpeg',
			'video/x-mpeg',
			'application/x-troff-msvideo',
			'application/vnd.rn-realmedia',
			'video/avi',
			'video/msvideo',
			'video/x-msvideo',
			'video/x-dv',
			'video/quicktime',
		]);
}());
