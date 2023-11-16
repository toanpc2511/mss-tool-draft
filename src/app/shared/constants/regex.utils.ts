const RG_FULLNAME = /[^0-9A-Za-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼỀẾỂỆỂỄÌÍỊỈĨÒÓỌỎÕỒỐỔỘỖỖỜƠỠỢỞỠƯÙÚỤỦŨỪỨỰỮỬỮỲÝỴỶỸ ]/g;
const RG_FULLNAME_CORE = /[^aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ ]/g;
const ONLY_NUMBER_REGEX = /[^0-9]/g;
const STR_NOT_SPEC_CHARACTER = /[^0-9A-Za-z]/g;
const RG_EMAIL = /^(?!([0-9]|.*_-)+@)([a-zA-Z0-9-_.+]+@)[a-zA-Z0-9_-]+\.[a-zA-Z0-9.]+$/;
export {
    RG_FULLNAME,
    ONLY_NUMBER_REGEX,
    RG_EMAIL,
    STR_NOT_SPEC_CHARACTER,
    RG_FULLNAME_CORE
};
