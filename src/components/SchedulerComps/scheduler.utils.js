export function dateFormat(format='',dateString=''){
    let date = (dateString != '') ? new Date(dateString) : new Date();
    if(format=='') {
        console.error('%cFunction.js[dateformat()]:%c format parameter is empty','font-weight:700','font-weight:400');
        return;
    }
    let m2 = date.toLocaleString('en-US',{month:'2-digit'});
    let lm = date.toLocaleString('en-US',{month:'long'});
    let sm = date.toLocaleString('en-US',{month:'long'}).substring(0,3);
    let d = date.toLocaleString('en-US',{day:'numeric'});
    let D = date.toLocaleString('en-US',{day:'2-digit'});
    let y = date.toLocaleString('en-US',{year:'numeric'});
    let h = date.toLocaleTimeString('en-US',{hour12:true,hour:'numeric'}).replace(/( AM)|( PM)/g,'');
    let H = date.toLocaleTimeString('en-US',{hour12:false,hour:'numeric'});
    let m = date.toLocaleTimeString('en-US',{minute:'numeric'});
    let M = date.toLocaleTimeString('en-US',{minute:'2-digit'});
    let s = date.toLocaleTimeString('en-US',{second:'numeric'});
    let S = date.toLocaleTimeString('en-US',{second:'2-digit'});
    let a = date.toLocaleTimeString('en-US',{hour12:true,hour:'numeric'}).replace(/[0-9]+ /g,'');

    format = format.replace(/%m2/g,m2);
    format = format.replace(/%lm/g,lm);
    format = format.replace(/%sm/g,sm);
    format = format.replace(/%d/g,d);
    format = format.replace(/%D/g,D);
    format = format.replace(/%y/g,y);
    format = format.replace(/%h/g,h);
    format = format.replace(/%H/g,H);
    format = format.replace(/%m/g,m);
    format = format.replace(/%M/g,M);
    format = format.replace(/%s/g,s);
    format = format.replace(/%S/g,S);
    format = format.replace(/%a/g,a);
    return format;
}

export function validateForm(obj,rules) {
    let validated = {
        allValid: true
    };
    
    for (let r in rules) {
        if ((rules[r] == "required" || rules[r].isRequired ) &&
            obj[r] == undefined || obj[r] == '' ) {
                validated[r] = 'empty';
        } else if ((rules[r] != "required" || rules[r].isRequired ) &&
            obj[r] == undefined || obj[r] == '' ) {
                validated[r] = true;  
        } else if (r != 'callback') {
            let emailregex = /[a-z0-9._]+@[a-z]+\.[a-z]{2,3}/i;
            let intregex = /[0-9]+/;
            let floatregex = /[0-9]+.[0-9]+/;

            validated[r] = true;

            if (rules[r].isEmail &&  obj[r].toLowerCase().match(emailregex))
                validated[r] = true;
            else if (rules[r].isEmail ) {
                validated[r] = 'invalid_email';
                continue;
            }

            if (rules[r].isInteger && obj[r].match(intregex))
                validated[r] = true;
            else if (rules[r].isInteger) {
                validated[r] = 'invalid_number';
                continue;
            }

            if (rules[r].isFloat && (obj[r].match(floatregex) || obj[r].match(intregex)))
                validated[r] = true;
            else if (rules[r].isFloat) {
                validated[r] = 'invalid_number';
                continue;
            }

            if (rules[r].regexMatch != null && obj[r].match(rules[r].regexMatch))
                validated[r] = true;
            else if (rules[r].regexMatch != null) {
                validated[r] = 'value_and_regex_not_match';
                continue;
            }

            if (rules[r].equalTo != null &&  obj[r] == rules[r].equalTo)
                validated[r] = true;
            else if (rules[r].equalTo != null) {
                validated[r] = 'values_not_match';
                continue;
            }

            if (typeof rules[r].maxChars == 'number' && rules[r].maxChars >= obj[r].length)
                validated[r] = true;
            else if (typeof rules[r].maxChars == 'number') {
                validated[r] = 'invalid_length_max';
                continue;
            }

            if (typeof rules[r].minChars == 'number' && rules[r].minChars <= obj[r].length)
                validated[r] = true;
            else if (typeof rules[r].minChars == 'number') {
                validated[r] = 'invalid_length_min';
                continue;
            }

            
        }
    }

    let someEmpty = false;

    if (rules.callback != null) {
        for (let v in validated) {
            if (validated[v] === 'empty') {
                validated.allValid = false;
                rules.callback(v);
                someEmpty = true;
                continue;
            }
        }
    }

    if (!someEmpty) {
        for (let v in validated) {
            if (validated[v] != true) {
                validated.allValid = false;
                if (rules[v].callback != null) {
                    rules[v].callback(validated[v]);
                    continue;
                }
            }
        }
    }

    return validated;
}