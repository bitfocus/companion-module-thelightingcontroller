const CRLF = '\u000d\u000a';
const SEPARATOR = '|';
const APPNAME = "thelightingcontrollerclient";
const ENCODING = "utf8";
const NAMEPREFIX = '$';

// Defines button types, including icons
const IMAGEHEAD='iVBORw0KGgoAAAANSUhEUgAAA';
const buttonTypes = [{
	id: 0,
	name: 'Steps',
	image: IMAGEHEAD + 'AgAAAALCAQAAADokgSuAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAGm2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAyLTA5VDIyOjI4OjE0WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDItMDlUMjM6MjI6MzFaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAyLTA5VDIzOjIyOjMxWiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjEiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJEb3QgR2FpbiAyMCUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZGJhMTc4YzEtMmNmOS0xZDQ3LWEyNjYtODAwNGMzN2I5MTAwIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZDI5OGJmZDAtNThiZi1mNzQ5LWJmY2MtOTBhNzcxODA5N2NlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZGE1Y2ZkYTAtNjBhMC1mZTQyLTg1ZGMtNTBmYWJkMjJjNTk1Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpkYTVjZmRhMC02MGEwLWZlNDItODVkYy01MGZhYmQyMmM1OTUiIHN0RXZ0OndoZW49IjIwMjAtMDItMDlUMjI6Mjg6MTRaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmM4ZmZjM2QwLTQyMzgtOTI0OC1hN2E1LTc1OTUwOWRmZTI2NSIgc3RFdnQ6d2hlbj0iMjAyMC0wMi0wOVQyMzowNDowOFoiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZGJhMTc4YzEtMmNmOS0xZDQ3LWEyNjYtODAwNGMzN2I5MTAwIiBzdEV2dDp3aGVuPSIyMDIwLTAyLTA5VDIzOjIyOjMxWiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuJXO6IAAABNSURBVAgdBcGBAMQwAACxDKEKU5jCFKpQlncaSxWqcJ9cAQAE05GPiFumYRHxygAihuNzQwSPLYsI4CcjAiAr4rEMyzEiXlu2Sa4AAH8nvybcXnnFbAAAAABJRU5ErkJggg==',
	imageFlash: IMAGEHEAD + 'EgAAAALCAQAAAB2KAMOAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAGU2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAyLTA5VDIyOjI4OjE0WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDItMDlUMjM6MDQ6MDhaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAyLTA5VDIzOjA0OjA4WiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjEiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJHcmF5IEdhbW1hIDIuMiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpjOGZmYzNkMC00MjM4LTkyNDgtYTdhNS03NTk1MDlkZmUyNjUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDozMDU5ZGEwZC1kOWI2LTE3NDktYjhkNC0zYzE0YTU5NTdlNmQiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpkYTVjZmRhMC02MGEwLWZlNDItODVkYy01MGZhYmQyMmM1OTUiPiA8cGhvdG9zaG9wOlRleHRMYXllcnM+IDxyZGY6QmFnPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IlMiIHBob3Rvc2hvcDpMYXllclRleHQ9IlMiLz4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmRhNWNmZGEwLTYwYTAtZmU0Mi04NWRjLTUwZmFiZDIyYzU5NSIgc3RFdnQ6d2hlbj0iMjAyMC0wMi0wOVQyMjoyODoxNFoiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YzhmZmMzZDAtNDIzOC05MjQ4LWE3YTUtNzU5NTA5ZGZlMjY1IiBzdEV2dDp3aGVuPSIyMDIwLTAyLTA5VDIzOjA0OjA4WiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmTY38UAAACxSURBVDjLzdStTQRhEAbgJyTLjyH5FP4U6GvhgsZsC6tQKEqgAhxtgDhLG2soYM0pxPGe+LKEDoaMmYx6MvNmRHWBKxFP0QejRezVgR5FvHbQRoyaqRB0ED+GDtqJ1udFoBsRz3RQs9jbFILexNHgbM3Q1ixlJ7t0FPHtcwXBi2gloPvf9vYviJhKQBeufYj3NUNbk2ayFG0IFnG+gnZmMRvLQj2Ih34k/+JT3/laU3MCGofOBKFIFc8AAAAASUVORK5CYII='
}, {
	id: 1,
	name: 'Generator',
	image: IMAGEHEAD + 'AoAAAALCAQAAADsZ9STAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAGm2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAyLTA5VDIyOjI4OjE0WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDItMDlUMjM6MjA6NDJaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAyLTA5VDIzOjIwOjQyWiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjEiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJEb3QgR2FpbiAyMCUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZWE1MDNiOWUtNzgyMS05ZjQwLTk2MGEtZGNlZjQ4MTIzMTBhIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6NzRkZjM3OWUtMjA4OS1hODQ1LWJhNDItZmU3ZGQ2MjVlNGY2IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZGMyMWE1YWEtMzRjNy02MjQ4LWE3MGMtMGU3NGQwNTY5NWJkIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpkYzIxYTVhYS0zNGM3LTYyNDgtYTcwYy0wZTc0ZDA1Njk1YmQiIHN0RXZ0OndoZW49IjIwMjAtMDItMDlUMjI6Mjg6MTRaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmFiZTFlYjNmLWY1YzAtMzI0ZS04NjE2LWEyMWUzMzBiZWMyOSIgc3RFdnQ6d2hlbj0iMjAyMC0wMi0wOVQyMzowNDozM1oiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZWE1MDNiOWUtNzgyMS05ZjQwLTk2MGEtZGNlZjQ4MTIzMTBhIiBzdEV2dDp3aGVuPSIyMDIwLTAyLTA5VDIzOjIwOjQyWiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkgRIwQAAABZSURBVAgdBcGBAMMwAADBU5hCFapQhShEYQpVKMsUohCFKvzuJEmSJAJuW7KIYNkuHAYRX68PABHLAwARGQAQkQmSXBHbAyAzYsrtxCEzguHnlSxnJEmSJH9Bp0DATLaEJgAAAABJRU5ErkJggg==',
	imageFlash: IMAGEHEAD + 'EgAAAALCAQAAAB2KAMOAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAGU2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAyLTA5VDIyOjI4OjE0WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDItMDlUMjM6MDQ6MzNaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAyLTA5VDIzOjA0OjMzWiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjEiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJHcmF5IEdhbW1hIDIuMiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphYmUxZWIzZi1mNWMwLTMyNGUtODYxNi1hMjFlMzMwYmVjMjkiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpjZmVmOGRiNy1lMmM5LTlmNGUtOGY0Ny03OTBjNTVmYjdhZTMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpkYzIxYTVhYS0zNGM3LTYyNDgtYTcwYy0wZTc0ZDA1Njk1YmQiPiA8cGhvdG9zaG9wOlRleHRMYXllcnM+IDxyZGY6QmFnPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IkciIHBob3Rvc2hvcDpMYXllclRleHQ9IkciLz4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmRjMjFhNWFhLTM0YzctNjI0OC1hNzBjLTBlNzRkMDU2OTViZCIgc3RFdnQ6d2hlbj0iMjAyMC0wMi0wOVQyMjoyODoxNFoiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YWJlMWViM2YtZjVjMC0zMjRlLTg2MTYtYTIxZTMzMGJlYzI5IiBzdEV2dDp3aGVuPSIyMDIwLTAyLTA5VDIzOjA0OjMzWiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvLYqF0AAAC4SURBVDiNxdIhTgNREAbgLyQL1JCg8FVF9woNGrNXWIXCwBF6ApIKrgECW7lXWMMB1qAQ5Ucsr6nB7psxkzHzJf+I2g0WIh6jLLYGEb06oAcRLwXUG2yw1FYCfYkfzQR6Mrp2rAqgGxHPTKDejqqgV3HQOMufqa0KunQQ8W1fQN2JZDM76O44ribQcBJZdLODLlx5F2/lhzqxtcayCghGcV5AtD6MInrrCqBG3E8BzXz8H9Ctz/Ixv3pbxA4oZT8lAAAAAElFTkSuQmCC'
}, {
	id: 2,
	name: 'Pixels',
	image: IMAGEHEAD + 'AgAAAALCAQAAADokgSuAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAGm2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAyLTA5VDIyOjI4OjE0WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDItMDlUMjM6MjI6MTJaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAyLTA5VDIzOjIyOjEyWiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjEiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJEb3QgR2FpbiAyMCUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDI4N2I0NWMtYmRiMi1jZjRkLWFmMWYtYzIyOGY0ZTcwZjhhIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MDAzNGJhZTgtZTM2Ny1iNzQ5LTk4MzEtY2ExNDQ0YTIzMjM0IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NWNiMTI4MjAtZjZlNC00MTQxLTliZDEtMzcwOWVhNjQ3ZGVjIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1Y2IxMjgyMC1mNmU0LTQxNDEtOWJkMS0zNzA5ZWE2NDdkZWMiIHN0RXZ0OndoZW49IjIwMjAtMDItMDlUMjI6Mjg6MTRaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmNkYzMwM2JmLWNkYjctOTY0NS1hN2YyLTJhNWE3NmExOWU1YSIgc3RFdnQ6d2hlbj0iMjAyMC0wMi0wOVQyMzowNToxMloiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDI4N2I0NWMtYmRiMi1jZjRkLWFmMWYtYzIyOGY0ZTcwZjhhIiBzdEV2dDp3aGVuPSIyMDIwLTAyLTA5VDIzOjIyOjEyWiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtDtNNsAAABESURBVAgdY/jPgApByIXhHZh9hsEYIpAGJAQZlBh2M5xBCIBAKMN/VIE0VAEloBm7EQIguJtBCVULAwMDDgEXNAFUCAB5EToLavdO9gAAAABJRU5ErkJggg==',
	imageFlash: IMAGEHEAD + 'EgAAAALCAQAAAB2KAMOAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAGU2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAyLTA5VDIyOjI4OjE0WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDItMDlUMjM6MDU6MTJaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAyLTA5VDIzOjA1OjEyWiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjEiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJHcmF5IEdhbW1hIDIuMiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpjZGMzMDNiZi1jZGI3LTk2NDUtYTdmMi0yYTVhNzZhMTllNWEiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo0YWZlMjE2OC0yMjMzLWE1NDMtYTg1YS0zMmM5ZDMyMmUwZWMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1Y2IxMjgyMC1mNmU0LTQxNDEtOWJkMS0zNzA5ZWE2NDdkZWMiPiA8cGhvdG9zaG9wOlRleHRMYXllcnM+IDxyZGY6QmFnPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IlAiIHBob3Rvc2hvcDpMYXllclRleHQ9IlAiLz4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjVjYjEyODIwLWY2ZTQtNDE0MS05YmQxLTM3MDllYTY0N2RlYyIgc3RFdnQ6d2hlbj0iMjAyMC0wMi0wOVQyMjoyODoxNFoiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6Y2RjMzAzYmYtY2RiNy05NjQ1LWE3ZjItMmE1YTc2YTE5ZTVhIiBzdEV2dDp3aGVuPSIyMDIwLTAyLTA5VDIzOjA1OjEyWiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoVCLwgAAACiSURBVDjLzdQtbgIBEAbQF5KlxZCg6le1ulcgaAxXQKFQPUldr9GKtZV7Cg6AQSGWr4IApReYZsy4eZk/UR1gImIbwtxeRO+1DLQR8X4GrcVMq9OXgQ7ipLmBYCVFoCcRb9yD1mWgDzFojH6DWr2uBPRoEHH0fQNFdNoS0OKaPt+PjJqzfzD1JT7/7lAVCPZifAHNy0GNWJ7r+xef+sXu0pAf7efTQ8jDfzgAAAAASUVORK5CYII='
}, {
	id: 3,
	name: 'Media',
	image: IMAGEHEAD + 'A0AAAALCAQAAAAOu8/qAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAGmGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAyLTA5VDIyOjI4OjE0WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDItMDlUMjM6MjE6MTNaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAyLTA5VDIzOjIxOjEzWiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjEiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJEb3QgR2FpbiAyMCUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjdhNzBiYjctMTgxYy1hYjRmLWEyOWItNTg5MjkwOTA3MWJjIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZWJlOTRkYTItZmFhNi00NTQwLTljMGYtZGIxOGQ4OTA2YzM4IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YTVjYjE4MjMtZjQ0ZC02MzRmLTk5MDMtZmU0Mzg5MTU1MmU5Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphNWNiMTgyMy1mNDRkLTYzNGYtOTkwMy1mZTQzODkxNTUyZTkiIHN0RXZ0OndoZW49IjIwMjAtMDItMDlUMjI6Mjg6MTRaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjU3ZDM1MzBmLTU2NjctYzU0NS05ODM0LWU1ODRhODA3MTVjNCIgc3RFdnQ6d2hlbj0iMjAyMC0wMi0wOVQyMzowOFoiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NjdhNzBiYjctMTgxYy1hYjRmLWEyOWItNTg5MjkwOTA3MWJjIiBzdEV2dDp3aGVuPSIyMDIwLTAyLTA5VDIzOjIxOjEzWiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvOHeAkAAACdSURBVBgZBcEhL8QBAMDR90XYJMmmKZJoJImNpok2QVNN8QEEUbpgnJ3NdkG9c8lU7fbP4v28J0mSJEki3mXHgZUXz0ZGZiYRybZjSZJPRSwlf05sOTSTC4uIQX5tujZ1a8NcihjkyLkkN/ZkFTHIvktJ7u3KKmKQuTV3fjxYN5FVRJKlM1dOfUuKeDI29mXq0YeFN2OvkSRJkiT5B/sEdZEBK7BfAAAAAElFTkSuQmCC',
	imageFlash: IMAGEHEAD + 'EgAAAALCAQAAAB2KAMOAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAGSmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAyLTA5VDIyOjI4OjE0WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDItMDlUMjM6MDhaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAyLTA5VDIzOjA4WiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjEiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJHcmF5IEdhbW1hIDIuMiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1N2QzNTMwZi01NjY3LWM1NDUtOTgzNC1lNTg0YTgwNzE1YzQiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDplMjk1MGNlNC03OGNjLTFmNGItYWM4Yy0zZWRhYzFiNzg0MjgiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphNWNiMTgyMy1mNDRkLTYzNGYtOTkwMy1mZTQzODkxNTUyZTkiPiA8cGhvdG9zaG9wOlRleHRMYXllcnM+IDxyZGY6QmFnPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IlAiIHBob3Rvc2hvcDpMYXllclRleHQ9IlAiLz4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmE1Y2IxODIzLWY0NGQtNjM0Zi05OTAzLWZlNDM4OTE1NTJlOSIgc3RFdnQ6d2hlbj0iMjAyMC0wMi0wOVQyMjoyODoxNFoiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NTdkMzUzMGYtNTY2Ny1jNTQ1LTk4MzQtZTU4NGE4MDcxNWM0IiBzdEV2dDp3aGVuPSIyMDIwLTAyLTA5VDIzOjA4WiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pie4yc4AAAD0SURBVDiNxdKvS8NhEAfgB2H+KFaTgkkNgs1iMhhEQTApaLMtiaBgs4rFYNNgNC3INpkgDLFuLolxtiEWQTBsZ/hubn/BO67ce3fh4cMrDLvAhBAOg+BRWLaho+heQUFNJTEoL4SrDBTCkp2BmxeRGPQtdOQyUEsIP3Yt2lQT8hpJQVNCOOnG41P4MOdU1blZdZE4oWuhLWekD9p20N2fWRU6CUHj2kL49dwHrTvq7i+tJAat/bfzfVDdtAvvbsyoJAaNmVQSir0/lM1b9h3b85a9E4LgSxjtge6Ulb2quvWk4UFZKSkoJ2wxEM8wCwuaWVDhDwXy2AAK5lhyAAAAAElFTkSuQmCC'
}, {
	id: 4,
	name: 'Timeline',
	image: IMAGEHEAD + 'A0AAAALCAQAAAAOu8/qAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAGm2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAyLTA5VDIyOjI4OjE0WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDItMDlUMjM6MjA6MDJaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAyLTA5VDIzOjIwOjAyWiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjEiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJEb3QgR2FpbiAyMCUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OGM5ODc2YzctNmY5ZC03YzQzLWJhMzUtMTZlOTFmM2JjMmE4IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6OWY0ZjVhYjktNzBlZS04OTQ2LThlZTItZTE5ZTNhZjk4NWRhIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NzliNjg3MmItNGUxYi0wMDRjLWE3YjctMzI0ZDMyYjM2ZjU0Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo3OWI2ODcyYi00ZTFiLTAwNGMtYTdiNy0zMjRkMzJiMzZmNTQiIHN0RXZ0OndoZW49IjIwMjAtMDItMDlUMjI6Mjg6MTRaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmUwZjU2N2RmLTNiNDQtOGU0ZS05NGZmLTA1YmIxYTUzMzQ1MCIgc3RFdnQ6d2hlbj0iMjAyMC0wMi0wOVQyMzowOTozMVoiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OGM5ODc2YzctNmY5ZC03YzQzLWJhMzUtMTZlOTFmM2JjMmE4IiBzdEV2dDp3aGVuPSIyMDIwLTAyLTA5VDIzOjIwOjAyWiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pliy/XIAAACqSURBVBgZBcExSkJxHADg7+UPnhJtSQpiS7W1BL1GvYBLm7M3kOgadYS6QltLV2gLGhoq0vIRIkkI2vv3fVkCAAAgce0SABRujJPAtp6BNYA9z3YIMHPnR8NSrnKma0Pg04t7Xyp1K3w4NycQdl0pPeqbWsv9qhE4tHGr9OTVRM2xoT8CU037mo7k2sKJpQWBdx0jC1sqmaTlwTeBA29OAVC4MCFLAAAA/gFuTi8ufI+uCQAAAABJRU5ErkJggg==',
	imageFlash: IMAGEHEAD + 'EgAAAALCAQAAAB2KAMOAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAGU2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAyLTA5VDIyOjI4OjE0WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDItMDlUMjM6MDk6MzFaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAyLTA5VDIzOjA5OjMxWiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjEiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJHcmF5IEdhbW1hIDIuMiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplMGY1NjdkZi0zYjQ0LThlNGUtOTRmZi0wNWJiMWE1MzM0NTAiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo2ZTkyN2ExNC0wODZiLTE3NDctODRkNi1jODE1NTk4MzdhYTMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3OWI2ODcyYi00ZTFiLTAwNGMtYTdiNy0zMjRkMzJiMzZmNTQiPiA8cGhvdG9zaG9wOlRleHRMYXllcnM+IDxyZGY6QmFnPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9IlAiIHBob3Rvc2hvcDpMYXllclRleHQ9IlAiLz4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjc5YjY4NzJiLTRlMWItMDA0Yy1hN2I3LTMyNGQzMmIzNmY1NCIgc3RFdnQ6d2hlbj0iMjAyMC0wMi0wOVQyMjoyODoxNFoiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZTBmNTY3ZGYtM2I0NC04ZTRlLTk0ZmYtMDViYjFhNTMzNDUwIiBzdEV2dDp3aGVuPSIyMDIwLTAyLTA5VDIzOjA5OjMxWiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pi5HSxkAAAD7SURBVDiNxdQ9K8VxFAfwT7eup8Eq78Ato+xSymYTSddDkVgkFGW4Ill0b0kkMkiSorBcFjYrb8ALsJgMHMPflbyAn/Ndzvjp2+kI/x3QKITZINgy7/d0OjSbGDQthO0MtOfKvbufPDu3khj0JnzK10AHJgwa02/YkIoLS0lBLUJYJAOVFLXKoQF0qZhKCtoXPuTlMtC6OScqRh3ZsGrThpmEoAYfQnj3kIHOlPTq0KRbQbsBl9YSgnp+1rYMVLFj0rBBI4YUlR1bSAiq1+xGuK7d0LyyR1V3qm5VPSkbTwiCV6GuBtq1/OcPnVpMCsoLfXyD/jsoeMm6CF+KkLhHAdoWRQAAAABJRU5ErkJggg=='
}, {
	id: 5,
	name: 'Macro',
	image: IMAGEHEAD + 'AsAAAALCAQAAAADpb+tAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAGm2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAyLTA5VDIyOjI4OjE0WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDItMDlUMjM6MjE6MzVaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAyLTA5VDIzOjIxOjM1WiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjEiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJEb3QgR2FpbiAyMCUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Njg4OGRmMTktYjFjZC1mMzRhLWJiYWUtNDlmYWY3YTcxNjAxIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MTMzZTk2MWItZjRkNi1kYjRiLTk4ZDctMmIzYzNlMjJhNWI0IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NmM3NDJiYjAtYzY1YS00YjQ0LTg2MDctZjEwOWNhMTVlMjhmIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2Yzc0MmJiMC1jNjVhLTRiNDQtODYwNy1mMTA5Y2ExNWUyOGYiIHN0RXZ0OndoZW49IjIwMjAtMDItMDlUMjI6Mjg6MTRaIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjNiZjkyNmNlLTY1OTgtNjc0ZS04NWM0LWEwN2VkMzBlZjM3NCIgc3RFdnQ6d2hlbj0iMjAyMC0wMi0wOVQyMzowMzozMloiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6Njg4OGRmMTktYjFjZC1mMzRhLWJiYWUtNDlmYWY3YTcxNjAxIiBzdEV2dDp3aGVuPSIyMDIwLTAyLTA5VDIzOjIxOjM1WiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoZL1RYAAABmSURBVAgdBcGBAAMxDADA+xhEoQpVeIUqPMumMIUqFGEMUwhCdnc1AADQ0L6AW3u1AEwDLAwCAyywgEDibeGRPpJA4pjS7ShJYOAoy20jCVA4HmkrSSDBNh0FBNIPBxsluRoAAPwBIt0bPhqWbnkAAAAASUVORK5CYII=',
	imageFlash: IMAGEHEAD + 'EgAAAALCAQAAAB2KAMOAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAGU2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAyLTA5VDIyOjI4OjE0WiIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDItMDlUMjM6MDM6MzJaIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTAyLTA5VDIzOjAzOjMyWiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjEiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJHcmF5IEdhbW1hIDIuMiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozYmY5MjZjZS02NTk4LTY3NGUtODVjNC1hMDdlZDMwZWYzNzQiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDowZWJiZWMzMi04MDY1LTA2NDEtOTliMy1hNzFhNjdjMjNiZWIiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2Yzc0MmJiMC1jNjVhLTRiNDQtODYwNy1mMTA5Y2ExNWUyOGYiPiA8cGhvdG9zaG9wOlRleHRMYXllcnM+IDxyZGY6QmFnPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9Ik0iIHBob3Rvc2hvcDpMYXllclRleHQ9Ik0iLz4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjZjNzQyYmIwLWM2NWEtNGI0NC04NjA3LWYxMDljYTE1ZTI4ZiIgc3RFdnQ6d2hlbj0iMjAyMC0wMi0wOVQyMjoyODoxNFoiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6M2JmOTI2Y2UtNjU5OC02NzRlLTg1YzQtYTA3ZWQzMGVmMzc0IiBzdEV2dDp3aGVuPSIyMDIwLTAyLTA5VDIzOjAzOjMyWiIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqSQo8cAAADLSURBVDjLzdQtTsVgEAXQE5LyY0iq8E+BZgsNGsMWqlCYsoSugOQJNtAFgKhFdgsYFlCDQjwu4kthBy0ZMxl1MrkzYusCZyIeogxiKnON6DcA3Yt4+gPFDuzFsAHoU3yrCmgnogPzJqALEY8U0LXoTWjF3rg66FkcVI4KqBGNqA1GvWll0KmDiC9vBdQKZq1Zq/e+Mujmt71cQDMGk6h15pVBJ869ipclQ50Zd2JkA9ByTMcLqAS6Fm0J9uqgStyW/+NffOorH2VR8QPd8sugZKwEgAAAAABJRU5ErkJggg=='
}];


var xmlStringParser = require('xml2js').parseString;
var tcp = require('../../tcp');
var instance_skel = require('../../instance_skel');
var debug;
var log;


function instance(system, id, config) {
	var self = this;

	self.CHOICES_INPUTS = [];
	self.CHOICES_OUTPUTS = [];
	self.CHOICES_PRESETS = [];

	self.state = {};

	// super-constructor
	instance_skel.apply(this, arguments);

	return self;
}

instance.prototype.init = function () {
	var self = this;

	debug = self.debug;
	log = self.log;

	self.status(self.STATE_UNKNOWN);
	self.init_tcp();
};

instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module is for controlling TheLightingController software, often released as Showtec QuickDMX, Chauvet ShowXpress or Sweetlight Controller.'
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Software IP Address',
			width: 12,
			default: '127.0.0.1',
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Port number',
			width: 12,
			default: '7348',
			regex: self.REGEX_PORT
		},
		{
			type: 'textinput',
			id: 'password',
			label: 'Password',
			width: 6
		}
	]
};

instance.prototype.updateConfig = function (config) {
	var self = this;

	self.config = config;
	self.init_tcp();
};

// When module gets deleted
instance.prototype.destroy = function () {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
	}

	debug("destroy", self.id);
};

instance.prototype.action = function (action) {
	var self = this;
	var cmd;
	var opt = action.options;

	switch (action.action) {
		/*
		 * Tempo controls
		 */
		case 'beat':
			cmd = 'BEAT';
			break;
		case 'bpmTap':
			cmd = 'BPM_TAP';
			break;
		case 'bpm':
			const bpm = Number(opt.bpm);
			if (isNaN(bpm) || bpm < 0 || bpm > 399) {
				log('error', `Invalid BPM value ${opt.bpm}.`);
			} else {
				cmd = `BPM${SEPARATOR}${bpm}`;
			}
			break;
		case 'autobpm':
			cmd = `AUTO_BPM_${(opt.state == 'true' ? 'ON' : 'OFF')}`;
			break;
		case 'freeze':
			cmd = `FREEZE_${(opt.state == 'true' ? 'ON' : 'OFF')}`;
			break;

		/*
		 * Cues
		 */
		case 'cue':
			if (opt.name) {
				cmd = `CUE${SEPARATOR}${opt.name}`;
			} else {
				log('error', `Cannot perform ${action.action} action as required cue name not specified.`);
			}
			break;

		/*
		 * Buttons
		 */
		case 'toggle':
		case 'press':
		case 'release':
		case 'togglePosition':
		case 'pressPosition':
		case 'releasePosition':
			var button = self.getButton(opt.name);
			if (button) {
				var press;
				switch (action.action) {
					case 'toggle':
					case 'togglePosition':
						press = !button.pressed;
						break;
					case 'press':
					case 'pressPosition':
						press = true;
						break;
					default:
						press = false;
						break;
				}
				cmd = `BUTTON_${(press ? 'PRESS' : 'RELEASE')}${SEPARATOR}${button.name}`;

				// Although we should get an acknowledgment anyway, update pre-emptively.
				self.setButton(button, press);
			} else {
				log('error', `Cannot perform ${action.action} action for unknown button ${(action.action.includes('Position') ? 'position' : 'index')} '${opt.name}'.`);
			}
			break;

		/*
		 * Faders
		 */
		case 'fader':
			var fader = self.getFader(opt.name);
			if (fader) {
				var value = opt.value;
				if (isNaN(value) || value > 100 || value < -100) {
					log('error', `Cannot perform ${action.action} action for fader ${opt.name}, as value '${value}' is invalid.`);
				} else {
					cmd = `FADER_CHANGE${SEPARATOR}${fader.index}${SEPARATOR}${value}`;

					// We don't get a confirmation from live, so we have to assume it worked here.
					self.setFader(fader, value);
				}
			} else {
				log('error', `Cannot perform ${action.action} action for unknown fader '${opt.name}'.`);
			}
			break;

		/*
		 * Sequential
		 */
		case 'sequentialGo':
			cmd = 'SEQUENTIAL_GO';
			break;
		case 'sequentialPause':
			cmd = 'SEQUENTIAL_PAUSE';
			break;
		case 'sequentialStop':
			cmd = 'SEQUENTIAL_STOP';
			break;

		/*
		 * Timeline
		 */
		case 'timelinePlayfrom':
			cmd = 'TIMELINE_PLAYFROM';
			break;
		case 'timelinePlay':
			cmd = 'TIMELINE_PLAY';
			break;
		case 'timelineStop':
			cmd = 'TIMELINE_STOP';
			break;

		/*
		 * Custom commands
		 */
		case 'refresh':
			cmd = 'BUTTON_LIST';
			break;
		case 'sendcustomcommand':
			cmd = opt.command;
			break;

		default:
			log('error', `Unknown action - ${action.action}`);
			break;
	}

	debug('action():', action);

	if (cmd !== undefined) {
		if (self.socket !== undefined) {
			debug(`sending '${cmd}' to ${self.socket.host}`);
			self.send(cmd);
		}
	}
};

instance.prototype.feedback = function (feedback, bank) {
	var self = this;
	var opt = feedback.options;

	switch (feedback.type) {
		/*
		 * Buttons
		 */
		case 'buttonColor':
		case 'buttonColorPosition':
			var button = self.getButton(opt.name);
			if (!button) {
				return {
					color: opt.disabledfg,
					bgcolor: opt.disabledbg
				};
			} else if (button.pressed) {
				var bg;
				if (opt.alpha < 0) {
					bg = rgb(0, 0, 0);
				} else if (opt.alpha > 255) {
					bg = rgb(255, 255, 255);
				} else {
					bg = opt.alpha * 0x1000000 + button.color;
				}
				return {
					color: self.rgb(255, 255, 255),
					bgcolor: bg
				};
			} else {
				return {
					color: self.rgb(0, 0, 0),
					bgcolor: button.color
				};
			}

		/*
		 * Faders
		 */
		case 'faderColor':
		case 'faderFadeColor':
			var fader = self.getFader(opt.name);
			if (!fader) {
				return {
					color: opt.disabledfg,
					bgcolor: opt.disabledbg
				};
			} else if (feedback.type == 'faderColor') {
				var delta = Math.abs(fader.value - opt.value);
				if (!isNaN(delta) && delta <= opt.tolerance) {
					return {
						color: opt.matchedfg,
						bgcolor: opt.matchedbg
					};
				}
			} else {
				var start = {
					value: opt.startValue,
					style: {
						color: opt.startfg,
						bgcolor: opt.startbg
					}
				};
				var end = {
					value: opt.endValue,
					style: {
						color: opt.endfg,
						bgcolor: opt.endbg
					}
				};
				var value = fader.value;

				// Swap start and end so start value always <= end value.
				if (start.value > end.value) {
					var t = start;
					start = end;
					end = t;
				}

				// Deal with out of range values.
				if (value <= start.value) {
					// Note as both checks are <=, then if start.value==end.value
					// the start colors will be chosen only when the value exactly
					// matches the start value, and the end colors will never match!
					return start.style;
				} else if (value >= end.value) {
					return end.style;
				}

				// Calculate percentage (0->1)
				// NOTE: Div by zero should never happen due to above checks
				var pc = (value - start.value) / (end.value - start.value);

				// Lerp
				var ss = start.style;
				var es = end.style;
				return {
					color: self.lerp(ss.color, es.color, pc),
					bgcolor: self.lerp(ss.bgcolor, es.bgcolor, pc)
				};
			}
			break;

		default:
			log('error', `Unknown feedback type - ${feedback.type}`);
			break;
	}
};

instance.prototype.error = function (err) {
	var self = this;
	debug(err);
	self.log('error', err);
	self.status(self.STATUS_ERROR, err);
};

// TCP protocol
instance.prototype.init_tcp = function () {
	var self = this;
	var receivebuffer = '';
	self.responseHandlers = {};

	if (self.socket !== undefined) {
		self.socket.destroy();
		delete self.socket;
	}

	if (self.config.host && self.config.port) {
		self.socket = new tcp(self.config.host, self.config.port);

		self.socket.on('status_change', function (status, message) {
			self.status(status, message);
		});

		self.socket.on('connect', function () {
			self.status(this.STATUS_UNKNOWN, 'Connected, waiting for server ready');
			// TODO Set encoding to be safe! self.socket.setEncoding(ENCODING);
			self.send(`HELLO${SEPARATOR}${APPNAME}${SEPARATOR}${self.config.password}`);
		});

		self.socket.on('error', function (err) {
			self.error(`Network error ${err}`);
		});

		self.socket.on('data', function (chunk) {
			var i = 0, line = '', offset = 0;
			receivebuffer += chunk;

			while ((i = receivebuffer.indexOf(CRLF, offset)) !== -1) {
				line = receivebuffer.substr(offset, i - offset);
				offset = i + 2;
				self.socket.emit('receiveline', line.toString());
			}
			receivebuffer = receivebuffer.substr(offset);
		});

		self.socket.on('receiveline', function (line) {
			self.receiveLine(line);
		});
	}
};

instance.prototype.receiveLine = function (line) {
	var self = this;
	let cmd = line;
	let data;
	if (line.indexOf(SEPARATOR) > -1) {
		const splitLine = line.split(SEPARATOR);
		cmd = splitLine[0];
		data = splitLine[1];
	}

	switch (cmd) {
		case 'HELLO':
			log('info', `Connected to ${self.config.host}:${self.config.port}`);
			self.status(self.STATUS_OK);

			// Update buttons
			self.send('BUTTON_LIST');
			break;
		case 'BPM':
			// TODO - this should generate a BPM response
			log('info', `BPM set to ${data}.`);
			break;
		case 'BEAT_ON':
			// TODO this requires BEATS to be sent
			log('info', `BPM ON - ${data}.`);
			break;
		case 'BEAT_OFF':
			log('info', `BPM OFF - ${data}.`);
			break;
		case 'BUTTON_LIST':
			xmlStringParser(data, (err, result) => {
				if (err) {
					return self.error(`The button list XML could not parsed. ${err}`);
				}

				self.updateState(result);
				log('info', `Successfully retrieved state.`);
			});
			break;
		case 'BUTTON_PRESS':
		case 'BUTTON_RELEASE':
			var button = self.getButton(NAMEPREFIX + data);
			var pressed = cmd == 'BUTTON_PRESS';
			if (button) {
				log('info', `Button ${data} was ${(pressed ? 'pressed' : 'released')}`);
				self.setButton(button, pressed);
			} else {
				log('error', `Button ${data} is unknown.`);
			}
			break;
		case 'FADER_CHANGE':
			var index = Number(data);
			var value = Number(line.split(SEPARATOR)[2]);
			var fader = self.getFader(index);
			if (fader) {
				log('debug', `Fader ${fader.name} was changed to ${value}.`);
				self.setFader(fader, value);
			} else {
				log('error', `Fader ${index} is unknown.`);
			}
			break;
		case 'INTERFACE_CHANGE':
			log('info', 'Interface change event received, updating state...');
			self.send('BUTTON_LIST');
			break;
		case 'ERROR':
			switch (data) {
				case 'BAD PASSWORD':
					self.error("The password is incorrect!");
					break;
				default:
					self.error(`Sofware responded with error: ${data}`);
					break;
			}
			break;
		default:
			log('error', `Unknown event received - ${line}`);
			break;
	}
};

instance.prototype.send = function (msg) {
	this.socket.send(msg + CRLF);
};

instance.prototype.parseName = function (name) {
	return name.replace(/~/g, '\\n');
}

instance.prototype.updateState = function (rawButtonList) {
	var self = this;
	const state = {
		pages: {},
		faders: {},
		buttons: {}
	};

	const variables = [];

	if (rawButtonList.buttons && rawButtonList.buttons.page) {
		var index = 0;
		rawButtonList.buttons.page.forEach((page) => {
			if (!page.$) { return; }
			const p = {
				index: ++index,
				name: page.$.name,
				columns: page.$.columns,
				columnButtons: {},
				buttons: {}
			}
			variables.push({ label: `Page ${p.index} name`, name: `page${p.index}Name` });
			variables.push({ label: `Page ${p.index} column count`, name: `page${p.index}Columns` });
			variables.push({ label: `Page ${p.index} button count`, name: `page${p.index}Buttons` });

			var col = 1;
			while (col <= p.columns) {
				if (page.$['colbuttons_' + col]) {
					p.columnButtons[col] = page.$['colbuttons_' + col];
				}
				col++;
			}
			if (page.button && page.button.length) {
				page.button.forEach((button) => {
					if (!button.$) { return; }
					var name = button['_'] || '';
					var safeName = self.parseName(name);
					var b = {
						index: Number(button.$.index),
						name: name,
						safeName: safeName,
						pressed: Boolean(Number(button.$.pressed)),
						flash: Boolean(Number(button.$.flash)),
						column: Number(button.$.column),
						line: Number(button.$.line),
						color: self.modifyBgColor(parseInt(button.$.color.substr(1), 16)),
						typeId: Number(button.$.type),
						page: p.index,
						pageName: p.name
					};

					b.position = `[${b.page}:${b.column},${b.line}]`;
					var type = buttonTypes[b.typeId];
					b.type = type || { id: b.typeId };

					// Add direct lookups by index and position
					p.buttons[b.name] = b;
					state.buttons[b.index] = b;
					state.buttons[b.position] = b;

					// We prepend name with $ to prevent collision with index/position
					// which always start with a number, or '(' respectively
					state.buttons[NAMEPREFIX + b.name] = b;

					// Create variables for index & position
					variables.push({ label: `Button ${b.index} name`, name: `button${b.index}Name` });
					variables.push({ label: `Button ${b.index} is pressed`, name: `button${b.index}Pressed` });
					variables.push({ label: `Button ${b.index} is flash`, name: `button${b.index}Flash` });
					variables.push({ label: `Button ${b.position} name`, name: `button${b.position}Name` });
					variables.push({ label: `Button ${b.position} is pressed`, name: `button${b.position}Pressed` });
					variables.push({ label: `Button ${b.position} is flash`, name: `button${b.position}Flash` });

					// TODO add type, e.g. Macro, Steps, etc.
				});
			}
			state.pages[p.name] = p;
		});
	}

	if (rawButtonList.buttons && rawButtonList.buttons.fader) {
		rawButtonList.buttons.fader.forEach((fader) => {
			if (!fader.$) { return; }
			var f = {
				index: Number(fader.$.index),
				name: fader['_'],
				value: Number(fader.$.value)
			};
			state.faders[f.index] = f;

			variables.push({ label: `Fader ${f.index} name`, name: `fader${f.index}Name` });
			variables.push({ label: `Fader ${f.index} value`, name: `fader${f.index}Value` });
		});
	}

	// Update state
	self.state = state;

	// Update variable defintions
	self.setVariableDefinitions(variables);

	// Set variables and create presets
	var presets = [];
	Object.values(self.state.pages).forEach((page) => {
		self.setVariable(`page${page.index}Name`, page.name);
		self.setVariable(`page${page.index}Columns`, page.columns);
		self.setVariable(`page${page.index}Buttons`, Object.keys(page.buttons).length);
	});

	var faderChoices = [];
	Object.values(self.state.faders).forEach((fader) => {
		self.setVariable(`fader${fader.index}Name`, fader.name);
		self.setVariable(`fader${fader.index}Value`, fader.value);
		faderChoices.push({ id: fader.index, label: `${fader.index}: ${fader.name}` });

		// Add fader presets
		presets.push({
			category: 'Faders',
			label: 'Set Fader to 0 (ON), and fade background with fader value.',
			bank: {
				style: 'text',
				text: `$(QuickDMX:fader${fader.index}Name)\\n$(QuickDMX:fader${fader.index}Value)`,
				size: 'auto',
				color: self.rgb(255, 255, 255),
				bgcolor: self.rgb(0, 0, 0)
			},
			actions: [
				{
					action: 'fader',
					options: {
						name: fader.index,
						value: 0
					}
				}
			],
			feedbacks: [
				{
					type: 'faderFadeColor',
					options: {
						name: fader.index
					}
				}
			]
		}, {
			category: 'Faders',
			label: 'Set Fader to -100 (OFF).',
			bank: {
				style: 'text',
				text: `$(QuickDMX:fader${fader.index}Name)\\nOFF`,
				size: 'auto',
				color: self.rgb(255, 255, 255),
				bgcolor: self.rgb(0, 0, 0)
			},
			actions: [
				{
					action: 'fader',
					options: {
						name: fader.index,
						value: -100
					}
				}
			],
			feedbacks: [
				{
					type: 'faderColor',
					options: {
						name: fader.index,
						value: -100,
						// Must match -100 exactly to be fully off
						tolerance: 0,
						matchedbg: self.rgb(128, 0, 0)
					}
				}
			]
		});
	});

	var buttonChoices = [];
	var buttonPositionChoices = [];
	Object.keys(self.state.buttons).forEach((key) => {
		// Only look at named version of button, to prevent triplication
		if (key.charAt(0) != NAMEPREFIX) { return; }
		var button = self.state.buttons[key];
		var flash = button.flash;

		self.setVariable(`button${button.index}Name`, button.safeName);
		self.setVariable(`button${button.index}Pressed`, button.pressed);
		self.setVariable(`button${button.index}Flash`, flash);
		self.setVariable(`button${button.position}Name`, button.safeName);
		self.setVariable(`button${button.position}Pressed`, button.pressed);
		self.setVariable(`button${button.position}Flash`, flash);
		/*
		self.setVariable(`button${button.index}Column`, button.column);
		self.setVariable(`button${button.index}Line`, button.line);
		self.setVariable(`button${button.index}Color`, button.color);
		*/
		buttonChoices.push({ id: button.index, label: `${button.pageName} #${button.index}: ${button.safeName}` });
		buttonPositionChoices.push({ id: button.position, label: `${button.pageName} ${button.position}: ${button.safeName}` });

		// Add button presets
		presets.push({
			category: 'Buttons by index',
			label: flash ? 'Press flash button' : 'Toggle button',
			bank: {
				style: 'png',
				text: `$(QuickDMX:button${button.index}Name)`,
				png64: flash ? button.type.imageFlash : button.type.image,
				alignment: 'center:bottom',
				pngalignment: 'left:top',
				size: 'auto',
				color: 0,
				bgcolor: button.color
			},
			actions: [
				{
					action: flash ? 'press' : 'toggle',
					options: {
						name: button.index
					}
				}
			],
			feedbacks: [
				{
					type: 'buttonColor',
					options: {
						name: button.index
					}
				}
			]
		}, {
			category: 'Buttons by position',
			label: flash ? 'Press flash button' : 'Toggle button',
			bank: {
				style: 'png',
				text: `$(QuickDMX:button${button.position}Name)`,
				png64: flash ? button.type.imageFlash : button.type.image,
				alignment: 'center:bottom',
				pngalignment: 'left:top',
				size: 'auto',
				color: 0,
				bgcolor: button.color
			},
			actions: [
				{
					action: (flash ? 'press' : 'toggle')+'Position',
					options: {
						name: button.position
					}
				}
			],
			feedbacks: [
				{
					type: 'buttonColorPosition',
					options: {
						name: button.position
					}
				}
			]
		});
	});

	presets.push({
		category: 'Miscellaneous',
		label: 'Refresh',
		bank: {
			style: 'text',
			text: 'Refresh\\nDMX',
			size: 'auto',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(0, 0, 0)
		},
		actions: [
			{
				action: 'refresh'
			}
		]
	}, {
		category: 'Miscellaneous',
		label: 'Tap',
		bank: {
			style: 'text',
			text: 'Tap\\nBPM',
			size: 'auto',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(0, 0, 0)
		},
		actions: [
			{
				action: 'bpmTap'
			}
		]
	}, {
		category: 'Miscellaneous',
		label: 'Beat',
		bank: {
			style: 'text',
			text: 'Beat',
			size: 'auto',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(0, 0, 0)
		},
		actions: [
			{
				action: 'beat'
			}
		]
	}, {
		category: 'Miscellaneous',
		label: 'Auto BPM',
		bank: {
			style: 'text',
			text: 'Auto\\nBPM',
			size: 'auto',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(0, 0, 0),
			latch: true
		},
		actions: [
			{
				action: 'autobpm',
				options: {
					state: 'true'
				}
			}
		],
		release_actions: [
			{
				action: 'autobpm',
				options: {
					state: 'false'
				}
			}
		]
	}, {
		category: 'Miscellaneous',
		label: 'Freeze',
		bank: {
			style: 'text',
			text: 'Freeze',
			size: '18',
			color: self.rgb(255, 255, 255),
			bgcolor: self.rgb(0, 0, 0),
			latch: true
		},
		actions: [
			{
				action: 'freeze',
				options: {
					state: 'true'
				}
			}
		],
		release_actions: [
			{
				action: 'freeze',
				options: {
					state: 'false'
				}
			}
		]
	})

	/*
	 * Update actions
	 */
	self.system.emit('instance_actions', self.id, {
		/*
		 * Tempo controls
		 */
		'bpm': {
			label: 'Set BPM',
			options: [{
				type: 'textinput',
				label: 'BPM',
				id: 'bpm',
				default: '120',
				regex: '/^\\d{1,3}$/'
			}]
		},
		'bpmTap': {
			label: 'Tap BPM'
		},
		'beat': {
			label: 'Send a beat'
		},
		'autobpm': {
			label: 'Set Auto BPM',
			options: [{
				type: 'dropdown',
				label: 'On/Off',
				id: 'state',
				choices: [{ id: 'false', label: 'Off' }, { id: 'true', label: 'On' }]
			}]
		},
		'freeze': {
			label: 'Freeze',
			options: [{
				type: 'dropdown',
				label: 'On/Off',
				id: 'state',
				choices: [{ id: 'false', label: 'Off' }, { id: 'true', label: 'On' }]
			}]
		},
		/*
		 * Cues
		 */
		'cue': {
			label: 'Toggle Cue',
			options: [{
				type: 'textInput',
				label: 'Button index',
				id: 'name',
				regex: self.REGEX_SOMETHING
			}]
		},
		/*
		 * Buttons
		 */
		'toggle': {
			label: 'Toggle Button, by index',
			options: [{
				type: 'dropdown',
				label: 'Button index',
				id: 'name',
				regex: self.REGEX_SOMETHING,
				choices: buttonChoices
			}]
		},
		'press': {
			label: 'Press Button, by index',
			options: [{
				type: 'dropdown',
				label: 'Button index',
				id: 'name',
				regex: self.REGEX_SOMETHING,
				choices: buttonChoices
			}]
		},
		'release': {
			label: 'Release Button, by index',
			options: [{
				type: 'dropdown',
				label: 'Button index',
				id: 'name',
				regex: self.REGEX_SOMETHING,
				choices: buttonChoices
			}]
		},
		'togglePosition': {
			label: 'Toggle Button, by position',
			options: [{
				type: 'dropdown',
				label: 'Button position',
				id: 'name',
				regex: self.REGEX_SOMETHING,
				choices: buttonPositionChoices
			}]
		},
		'pressPosition': {
			label: 'Press Button, by position',
			options: [{
				type: 'dropdown',
				label: 'Button position',
				id: 'name',
				regex: self.REGEX_SOMETHING,
				choices: buttonPositionChoices
			}]
		},
		'releasePosition': {
			label: 'Release Button, by position',
			options: [{
				type: 'dropdown',
				label: 'Name',
				id: 'name',
				regex: self.REGEX_SOMETHING,
				choices: buttonPositionChoices
			}]
		},
		/*
		 * Faders
		 */
		'fader': {
			label: 'Set fader value',
			options: [{
				type: 'dropdown',
				label: 'Fader',
				id: 'name',
				regex: self.REGEX_SOMETHING,
				choices: faderChoices
			},
			{
				type: 'textinput',
				label: 'Value (-100 -> 100)',
				id: 'value',
				regex: '/^[+-]?(100|[0-9]|[0-9][0-9])$/'
			}]
		},
		/*
		 * Sequential
		 */
		'sequentialGo': {
			label: 'Sequential Go'
		},
		'sequentialPause': {
			label: 'Sequential Pause'
		},
		'sequentialStop': {
			label: 'Sequential Stop'
		},
		/*
		 * Timeline
		 */
		'timelinePlayfrom': {
			label: 'Timeline Play From'
		},
		'timelinePlay': {
			label: 'Timeline Play'
		},
		'timelineStop': {
			label: 'Timeline Stop'
		},
		/*
		 * Custom commands
		 */
		'refresh': {
			label: 'Refresh interface'
		},
		'sendcustomcommand': {
			label: 'Send custom command',
			options: [{
				type: 'textinput',
				label: 'Command',
				id: 'command',
				default: 'HELLO',
				tooltip: "Enter any command you like in plain ASCII. Beware of correct syntax, you mustn't enter the linefeed at the end of the command.",
				regex: self.REGEX_SOMETHING
			}]
		}
	});

	/*
	 * Update feedbacks
	 */
	self.setFeedbackDefinitions({
		/*
		 * Buttons
		 */
		buttonColor: {
			label: 'Synchronise button colors, by index',
			description: 'Will synchronise the button colours using the specified button\'s index.',
			options: [{
				type: 'dropdown',
				label: 'Button index',
				id: 'name',
				regex: self.REGEX_SOMETHING,
				choices: buttonChoices
			},
			{
				type: 'textinput',
				label: 'Pressed alpha',
				id: 'alpha',
				default: '128',
				tooltip: 'A number from 0 to 255, where 0 will set the backgound of pressed buttons to black, and 255 will not affect the background.',
				regex: '/^(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])$/'
			},
			{
				type: 'colorpicker',
				label: 'Disabled Foreground color',
				id: 'disabledfg',
				default: self.rgb(80, 80, 80)
			},
			{
				type: 'colorpicker',
				label: 'Disabled Background color',
				id: 'disabledbg',
				default: self.rgb(0, 0, 0)
			}]
		},
		buttonColorPosition: {
			label: 'Synchronise button colors, by position',
			description: 'Will synchronise the button colours using the specified button\'s position.',
			options: [{
				type: 'dropdown',
				label: 'Name',
				id: 'name',
				regex: self.REGEX_SOMETHING,
				choices: buttonPositionChoices
			},
			{
				type: 'textinput',
				label: 'Pressed alpha',
				id: 'alpha',
				default: '128',
				tooltip: 'A number from 0 to 255, where 0 will set the backgound of pressed buttons to black, and 255 will not affect the background.',
				regex: '/^(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])$/'
			},
			{
				type: 'colorpicker',
				label: 'Disabled Foreground color',
				id: 'disabledfg',
				default: self.rgb(80, 80, 80)
			},
			{
				type: 'colorpicker',
				label: 'Disabled Background color',
				id: 'disabledbg',
				default: self.rgb(0, 0, 0)
			}]
		},
		/*
		 * Faders
		 */
		faderColor: {
			label: 'Match fader value',
			description: 'Will set the button color when the specified fader\'s value matches a specific value.',
			options: [{
				type: 'dropdown',
				label: 'Fader',
				id: 'name',
				regex: self.REGEX_SOMETHING,
				choices: faderChoices
			},
			{
				type: 'textinput',
				label: 'Value (-100 -> 100) to match',
				id: 'value',
				default: 0,
				tooltip: 'Value of fader to match',
				regex: '/^[+-]?(100|[0-9]|[0-9][0-9])$/'
			},
			{
				type: 'textinput',
				label: 'Tolerance (0 -> 100)',
				id: 'tolerance',
				default: 10,
				tooltip: 'Values within +/-tolerance of the specified value will be considered as matching.',
				regex: '/^(100|[0-9]|[0-9][0-9])$/'
			},
			{
				type: 'colorpicker',
				label: 'Matched Foreground color',
				id: 'matchedfg',
				default: self.rgb(255, 255, 255)
			},
			{
				type: 'colorpicker',
				label: 'Matched Background color',
				id: 'matchedbg',
				default: self.rgb(0, 128, 0)
			},
			{
				type: 'colorpicker',
				label: 'Disabled Foreground color',
				id: 'disabledfg',
				default: self.rgb(80, 80, 80)
			},
			{
				type: 'colorpicker',
				label: 'Disabled Background color',
				id: 'disabledbg',
				default: self.rgb(0, 0, 0)
			}]
		},
		faderFadeColor: {
			label: 'Fade with fader value',
			description: 'Will adjust the button\'s colors as the specified fader\'s value changes.',
			options: [{
				type: 'dropdown',
				label: 'Fader',
				id: 'name',
				regex: self.REGEX_SOMETHING,
				choices: faderChoices
			},
			{
				type: 'textinput',
				label: 'Start value (-100 -> 100)',
				id: 'startValue',
				default: 0,
				tooltip: 'Start value of fade range (values outside the range will be clamped).',
				regex: '/^[+-]?(100|[0-9]|[0-9][0-9])$/'
			},
			{
				type: 'textinput',
				label: 'End value (-100 -> 100)',
				id: 'endValue',
				default: -100,
				tooltip: 'Start value of fade range (values outside the range will be clamped).',
				regex: '/^[+-]?(100|[0-9]|[0-9][0-9])$/'
			},
			{
				type: 'colorpicker',
				label: 'Start Foreground color',
				id: 'startfg',
				default: self.rgb(255, 255, 255)
			},
			{
				type: 'colorpicker',
				label: 'Start Background color',
				id: 'startbg',
				default: self.rgb(0, 200, 0)
			},
			{
				type: 'colorpicker',
				label: 'End Foreground color',
				id: 'endfg',
				default: self.rgb(255, 255, 255)
			},
			{
				type: 'colorpicker',
				label: 'End Background color',
				id: 'endbg',
				default: self.rgb(0, 0, 0)
			},
			{
				type: 'colorpicker',
				label: 'Disabled Foreground color',
				id: 'disabledfg',
				default: self.rgb(80, 80, 80)
			},
			{
				type: 'colorpicker',
				label: 'Disabled Background color',
				id: 'disabledbg',
				default: self.rgb(0, 0, 0)
			}]
		}
	});

	// Update presets
	self.setPresetDefinitions(presets);

	// Check feedbacks
	self.checkFeedbacks('buttonColor');
	self.checkFeedbacks('buttonColorPosition');
	self.checkFeedbacks('faderColor');
	self.checkFeedbacks('faderFadeColor');
};

instance.prototype.getButton = function (name) {
	var self = this;
	return name && self.state.buttons && self.state.buttons[name];
};

instance.prototype.setButton = function (button, pressed) {
	if (button.pressed == pressed) {
		return;
	}
	var self = this;
	button.pressed = pressed;
	self.setVariable(`button${button.index}Pressed`, button.pressed);
	self.setVariable(`button${button.position}Pressed`, button.pressed);
	self.checkFeedbacks('buttonColor');
	self.checkFeedbacks('buttonColorPosition');
};

instance.prototype.getFader = function (index) {
	return this.state.faders[index];
};

instance.prototype.setFader = function (fader, value) {
	if (fader.value == value) {
		return;
	}
	var self = this;
	fader.value = value;
	self.setVariable(`fader${fader.index}Name`, fader.name);
	self.setVariable(`fader${fader.index}Value`, fader.value);
	self.checkFeedbacks('faderColor');
	self.checkFeedbacks('faderFadeColor');
};

instance.prototype.modifyBgColor = function (color) {
	// Original controller software takes RGB values and reduces them to a range of 85->212
	// This prevents collisions with black or white text.
	var self = this;
	var c = self.toColor(color);

	return this.fromColor({
		r: (c.r >> 1) + 85,
		g: (c.g >> 1) + 85,
		b: (c.b >> 1) + 85,
		a: c.a
	});
}

instance.prototype.lerp = function (start, end, amount) {
	if (start == end || amount <= 0) return start;
	if (amount >= 1) return end;

	var self = this;
	var sc = self.toColor(start);
	var ec = self.toColor(end);

	return this.fromColor({
		r: sc.r + Math.round(amount * (ec.r - sc.r)),
		g: sc.g + Math.round(amount * (ec.g - sc.g)),
		b: sc.b + Math.round(amount * (ec.b - sc.b)),
		a: sc.a + Math.round(amount * (ec.a - sc.a))
	});
}

instance.prototype.toColor = function (color) {
	return {
		b: color & 0xFF,
		g: (color & 0xFF00) >>> 8,
		r: (color & 0xFF0000) >>> 16,
		a: ((color & 0xFF000000) >>> 24) / 255
	};
}
instance.prototype.fromColor = function (color) {
	return (((color.r & 0xff) << 16) |
		((color.g & 0xff) << 8) |
		(color.b & 0xff))
		+ color.a * 0x1000000
}

instance_skel.extendedBy(instance);
exports = module.exports = instance;