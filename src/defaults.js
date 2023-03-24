import {hexToHsl} from './functions'

export const formData = {
    "form_title":"New Form",
    "declare":{
        "paypal":"asdasd"
    },
    "design":{
        primaryColor: '#446523',
        pagenavDesign: 'row',
    },
    "pages": [
        {
            "page_title" : "Schedule Selection",
            "page_columns" : 1,
            "page_fields" : [
                {
                    "content_type" : "text",
                    "text": "Sample Header",
                    "column": 1,
                    "styles": "background-color:#eee;text-align:center;padding:5px;margin-bottom:10px;font-weight:700"
                },
                {
                    "content_type" : "text",
                    "text": "The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex! Fox nymphs grab quick-jived waltz. Brick quiz whangs jumpy veldt fox. ",
                    "column": 2,
                    "grid": '1fr 1fr',
                    "styles": "text-align:center"
                },
                {
                    "content_type" : "field",
                    "type": "text",
                    "name": "name",
                    "label": "Name",
                    "value": "",
                    "column": 2,
                    "grid": '1fr 1fr',
                    "readonly": false,
                    "required": true,
                    "placeholder": "Enter your name here",
                    "values": [{label:'1',value:1},{label:'1',value:2}],
                    "select": [],
                    "options": {},
                    "index": "",
                    "styles": {}
                },
                {
                    "content_type" : "field",
                    "type": "radio-group",
                    "name": "gender",
                    "label": "Gender",
                    "value": "",
                    "column": 2,
                    "grid": '1fr 1fr',
                    "readonly": false,
                    "required": true,
                    "placeholder": "",
                    "values": [{label:'Male',value:1},{label:'Female',value:2}],
                    "select": [],
                    "options": {},
                    "index": "",
                    "styles": {}
                },
                {
                    "content_type" : "field",
                    "type": "checkbox-group",
                    "name": "availiability",
                    "label": "Availiability",
                    "value": "",
                    "column": 2,
                    "grid": '1fr 1fr',
                    "readonly": false,
                    "required": true,
                    "placeholder": "",
                    "values": [{label:'Weekdays',value:0},{label:'Weekends',value:1}],
                    "select": [],
                    "options": {},
                    "index": "",
                    "styles": {}
                },
                {
                    "content_type" : "field",
                    "type": "select",
                    "name": "availiability",
                    "label": "Availiability",
                    "value": "",
                    "column": 2,
                    "grid": '1fr 1fr',
                    "readonly": false,
                    "required": true,
                    "placeholder": "",
                    "values": [{label:'Weekdays',value:0},{label:'Weekends',value:1}],
                    "select": [],
                    "options": {},
                    "index": "",
                    "styles": {}
                },
            ]
        },
        {
            "page_title" : "Payment",
            "page_columns" : 1,
            "page_fields" : [
                {
                    "content_type" : "text",
                    "text": "Hello, and good morning to you!",
                    "column": 1,
                    "styles": "text-align:center"
                },
                {
                    "content_type" : "text",
                    "text": "Hi, good morning to you too!",
                    "column": 2,
                    "grid": '1fr 1fr',
                    "styles": "text-align:center"
                },
            ]
        },
         {
            "page_title" : "Personal Details",
            "page_columns" : 1,
            "page_fields" : [
                {
                    "content_type" : "text",
                    "text": "Sample Header",
                    "column": 1,
                    "styles": "background-color:#eee;text-align:center;padding:5px;margin-bottom:10px;font-weight:700"
                },
                {
                    "content_type" : "text",
                    "text": "The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex! Fox nymphs grab quick-jived waltz. Brick quiz whangs jumpy veldt fox. ",
                    "column": 2,
                    "grid": '1fr 1fr',
                    "styles": "text-align:center"
                },
                {
                    "content_type" : "field",
                    "type": "text",
                    "name": "name",
                    "label": "Name",
                    "value": "",
                    "column": 2,
                    "grid": '1fr 1fr',
                    "readonly": false,
                    "required": true,
                    "placeholder": "Enter your name here",
                    "values": [{label:'1',value:1},{label:'1',value:2}],
                    "select": [],
                    "options": {},
                    "index": "",
                    "styles": {}
                },
                {
                    "content_type" : "field",
                    "type": "radio-group",
                    "name": "gender",
                    "label": "Gender",
                    "value": "",
                    "column": 2,
                    "grid": '1fr 1fr',
                    "readonly": false,
                    "required": true,
                    "placeholder": "",
                    "values": [{label:'Male',value:1},{label:'Female',value:2}],
                    "select": [],
                    "options": {},
                    "index": "",
                    "styles": {}
                },
                {
                    "content_type" : "field",
                    "type": "checkbox-group",
                    "name": "availiability",
                    "label": "Availiability",
                    "value": "",
                    "column": 2,
                    "grid": '1fr 1fr',
                    "readonly": false,
                    "required": true,
                    "placeholder": "",
                    "values": [{label:'Weekdays',value:0},{label:'Weekends',value:1}],
                    "select": [],
                    "options": {},
                    "index": "",
                    "styles": {}
                },
                {
                    "content_type" : "field",
                    "type": "select",
                    "name": "availiability",
                    "label": "Availiability",
                    "value": "",
                    "column": 2,
                    "grid": '1fr 1fr',
                    "readonly": false,
                    "required": true,
                    "placeholder": "",
                    "values": [{label:'Weekdays',value:0},{label:'Weekends',value:1}],
                    "select": [],
                    "options": {},
                    "index": "",
                    "styles": {}
                },
            ]
        }
    ]
}


function fgColor(color) {
    const hslColor = hexToHsl(color);
    if(hslColor.l > 50) return '#333333';
    else return '#ffffff';
}

function getColorRelativeLightness(color,amount) {
    let r = parseInt(color.substring(1,3),16);
    let g = parseInt(color.substring(3,5),16);
    let b = parseInt(color.substring(5,7),16);
    r+=amount
    g+=amount
    b+=amount
    r = Math.min(r,255)
    g = Math.min(g,255)
    b = Math.min(b,255)

    return '#'+r.toString(16)+g.toString(16)+b.toString(16)
}

export const formCSS = (primaryColor,navPlacement)=>{
return `
#pwfv-parent{
    width:100%;
    margin: 0 auto;
    border-radius: 7px 7px;
    background:#fff;
}

.pwfv-header{
    border-radius: 7px 7px 0 0;
    padding: 15px;
    font-size: 24px;
    font-weight: 700;
    background: ${primaryColor};
    color: ${fgColor(primaryColor)};
}

.pwfv-navigation{
    width: ${navPlacement == 'row' ? '300px' : '100%'};
    box-shadow: inset 0 0 10px -5px #777;
    padding: 10px;
    border-radius: 0 0 10px 10px;
    display: ${navPlacement == 'row' ? 'block':'grid'};
    grid-template-columns: 1fr 1fr 1fr;
    gap:10px;
}

.pwfv-navigation-item{
    border-width: 1px;
    padding: 5px 10px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    margin-bottom:5px;
    gap:10px;
}

.pwfv-navigation-item:hover{
    background:${getColorRelativeLightness(primaryColor, 30)};
    color: ${fgColor(primaryColor)};
}

.pwfv-navigation-item.active{
    background:${primaryColor};
    color: ${fgColor(primaryColor)};
}



.pwfv-navigation-item span{
    display: block;
    font-weight:bold;
    border-radius: 50%;
    background: ${primaryColor};
    width: 24px;
    height: 24px;
    line-height: 22px;
    text-align: center;
    color:${fgColor(primaryColor)};
}

.pwfv-navigation-item.done{
    border: 1px solid ${getColorRelativeLightness(primaryColor,50)};
}

.pwfv-navigation-item.active span{
    background: ${fgColor(primaryColor)};
    color:${primaryColor};
}


.pwfv-body{
    display: flex;
    flex-direction:${navPlacement};
    flex-grow: 1;

}

.pwfv-maingrid{
    flex-grow:1;
    padding: 20px 20px;
    display:flex;
    width:100%
}

.pwfv-maingrid > div{
    width:100%;
}

.pwfv-maingrid > div:nth-child{
    width:50%
}


.pwfv-fielditem > div > label span{
    color:#A00
}

.pwfv-fielditem >  div > label{
    margin-bottom:5px;
    display:block;
}

.pwfv-fielditem:not(:first-child) > div > label{
    margin-top:10px;
}


*{font-size:15px}
input[class^='pwfvf-']:not([type="radio"]):not([type="checkbox"]),textarea{
    all:unset;
    width: calc(100% - 20px);
    padding: 5px 7px;
    border-bottom: 2px solid ${primaryColor};
    font-size: 15px;
    background:#eee;
    box-shadow: 0 -1px 3px ${primaryColor}33;
}


textarea{height: 150px;}


.pwfvf-checkbox-group,.pwfvf-radio-group{
    display: grid;
    gap:5px
}

.pwfvf-checkbox-group label, .pwfvf-radio-group label{
    padding: 5px 7px;
    border-bottom: 2px solid ${primaryColor};
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin:0;
    position:relative;
}

.pwfvf-checkbox-group label:after, .pwfvf-radio-group label:after{
    content:'';
    border: 2px solid ${primaryColor};
    width: 20px;
    height:20px;
    line-height:17px;
    text-align:center;
    font-weight:700;
}

.pwfvf-radio-group label:after{
    border-radius:20px;
    content:'';
}

.pwfvf-checkbox-group label.active:after{
    content:'\\2713';
}

.pwfvf-checkbox-group label.active:after, .pwfvf-radio-group label.active:after{
    border: 2px solid ${fgColor(primaryColor)};
}

.pwfvf-checkbox-group label.active, .pwfvf-radio-group label.active{
    background: ${getColorRelativeLightness(primaryColor,30)};
    color: ${fgColor(primaryColor)}
}

.pwfvf-radio-group label.active:after{
    border: 5px solid ${fgColor(primaryColor)};
}

.pwfvf-checkbox-group input, .pwfvf-radio-group input{
    float: right;
    outline: none;
}

.pwfvf-radio-group{
    display: grid;
}

.pwfvf-custom-field{padding: 0;}


.pwfvf-select{
    padding: 5px 7px;
    padding-right: 50px;
    border-bottom: 2px solid ${primaryColor};
    position: relative;
    background:#eee;
    box-shadow: 0 -1px 3px ${primaryColor}33;
}

.pwfvf-select-caret-down{
    position: absolute;
    top:5px;
    right:10px;
    transition: 0.2s;
}

.pwfvf-select.shown .pwfvf-select-caret-down{
    transform: scale(-1);
    user-select: none;
}


.pwfvf-select-menu{
    background: #fff;
    position: absolute;
    top:99%;
    left:0;
    width: 100%;
    overflow: hidden;
    border: 1px solid #ddd;

    border-radius: 0 0 5px 5px;
    z-index: 99;
    display: none;
    max-height: 200px;
    overflow: auto;
}


.pwfvf-select.shown .pwfvf-select-menu{display: block;}

.pwfvf-select-option{
    padding: 5px 7px;
}

.pwfvf-select-option:hover{
    background: #eee;
}

.pwfvf-field-error{
    padding: 5px;
    margin: 5px 0 10px;
    display: block;
    background: #fbcdcd;
    border: 1px solid #dfaeae;
    color: #773434;
}

textarea{white-space: pre-wrap;height:unset;min-height: 70px;}


`};