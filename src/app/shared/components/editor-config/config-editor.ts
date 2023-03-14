import { FileService } from './../../services/file.service';
import { AngularEditorConfig } from './config';

import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

export function getConfigEditor(
	toastr: ToastrService,
	fileService: FileService
): AngularEditorConfig {
	return {
		editable: true,
		spellcheck: true,
		minHeight: '15rem',
		maxHeight: '25rem',
		placeholder: 'Nhập nội dung tin tức',
		translate: 'no',
		sanitize: false,
		defaultFontSize: '4',
		toolbarPosition: 'top',
		defaultFontName: 'Times New Roman',
		defaultParagraphSeparator: 'p',
		upload: (file: File) => {
			const formData = new FormData();
			formData.append('images', file);
			if (file.size > 15360000) {
				toastr.error('Dung lượng ảnh quá lớn. Vui lòng chọn ảnh có dung lượng thấp hơn 15MB');
				return new Observable<HttpResponse<null>>();
			}
			return fileService.uploadImage(formData);
		},
		toolbarHiddenButtons: [
			['subscript', 'superscript'],
			['insertVideo', 'removeFormat', 'toggleEditorMode']
		]
	};
}
