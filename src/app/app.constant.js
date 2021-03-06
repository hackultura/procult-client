(function () {
	'use strict';

	angular
		.module('procultApp')
		.constant('API_URI_PREFIX', 'http://localhost:8000/api/v1')
		.constant('PROPOSAL_LIMIT', 2)
		.constant('PROPOSAL_STATUS', {
			draft: 'draft',
			sended: 'sended',
			analysis: 'analysis',
			approved: 'approved',
			reproved: 'reproved',
			enable_print: ['sended', 'approved', 'reproved'],
			block_insert: ['sended', 'analysis', 'approved', 'reproved'],
			block_update: ['sended', 'analysis', 'approved', 'reproved', 'canceled']
		})
		.constant('ACCEPTED_FORMAT_UPLOADS', [
			'.pdf', '.doc', '.docx', '.xls', '.xlsx',
			'.ppt', '.pptx', '.odt', '.ods', '.odp', '.odg',
			'.png', '.jpg', '.jpeg', '.gif', '.tiff', '.bmp',
			'.mp3', '.ogg', '.mp4', '.mpeg', '.rmvb', '.wav',
			'.aiff', '.voc', '.midi', '.mpg', '.mov', '.webm',
			'.dv', '.svg', '.cdr',
			'.zip', '.7z', '.rar',
		])
		.constant('ADMIN_REGION', [
        "Brasília", "Gama", "Taguatinga", "Brazlândia",
        "Sobradinho", "Planaltina", "Paranoá", "Núcleo Bandeirante",
        "Ceilândia", "Guará", "Cruzeiro", "Samambaia", "Santa Maria",
        "São Sebastião", "Recanto das Emas", "Lago Sul", "Riacho Fundo",
        "Lago Norte", "Candangolândia", "Águas Claras", "Riacho Fundo II",
        "Sudoeste/Octogonal", "Varjão", "Park Way", "SCIA", "Sobradinho II",
        "Jardim Botânico", "Itapoã", "SIA", "Vicente Pires", "Fercal",
		]);
}());
