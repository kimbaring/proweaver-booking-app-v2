
/**
 * Custom function to validate a input forms
 * 
 * This function will take an object that was submitted to the form and validate it
 * @author NS Developer Team
 * @param {object} obj These are object that pass from forms
 * @param {object} rules These are rules to identify if the field is a required or not
 * 
 * @return callback function that will tell if all are valid or there is a error
 * 
 */
import axiosA from "axios";
import {ref,watch} from 'vue';


function validateForm(obj,rules) {
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

function formatDateString(dateString) {
    let digits = dateString.matchAll(/[0-9]+/g);
    let digitsArr = [];

    for (const d of digits) {
        if (new String(d).length == 1) digitsArr.push("0" + d);
        else digitsArr.push(d);
    }

    let newString = '';

    for (let i = 0; i < digitsArr.length; i++) {
        if (i < 2) newString = newString + digitsArr[i] + "-";
        else if (i == 2) newString = newString + digitsArr[i] + " ";
        else if (i > 2 && i != digitsArr.length-1) newString = newString + digitsArr[i] + ":";
        else if (i == digitsArr.length-1) newString = newString + digitsArr[i];
    }

    return newString;
}

function dateFormat(format='',dateString=''){
    let date = (dateString != '') ? new Date(dateString) : new Date();
    if(format=='') {
        console.error('%cFunction.js[dateformat()]:%c format parameter is empty','font-weight:700','font-weight:400');
        return;
    }
    let M = date.toLocaleString('en-US',{month:'2-digit'});
    let m = date.toLocaleString('en-US',{month:'numeric'});
    let lm = date.toLocaleString('en-US',{month:'long'});
    let sm = date.toLocaleString('en-US',{month:'long'}).substring(0,3);
    let d = date.toLocaleString('en-US',{day:'numeric'});
    let D = date.toLocaleString('en-US',{day:'2-digit'});
    let y = date.toLocaleString('en-US',{year:'numeric'});
    let h1 = date.toLocaleTimeString('en-US',{hour12:true,hour:'numeric'}).replace(/( AM)|( PM)/g,'');
    let h = date.toLocaleTimeString('en-US',{hour12:true,hour:'2-digit'}).replace(/( AM)|( PM)/g,'');
    let H1 = date.toLocaleTimeString('en-US',{hour12:false,hour:'numeric'});
    let H = date.toLocaleTimeString('en-US',{hour12:false,hour:'2-digit'});
    let i = date.toLocaleTimeString('en-US',{minute:'numeric'});
    let I = date.toLocaleTimeString('en-US',{minute:'2-digit'});
    let s = date.toLocaleTimeString('en-US',{second:'numeric'});
    let S = date.toLocaleTimeString('en-US',{second:'2-digit'});
    let a = date.toLocaleTimeString('en-US',{hour12:true,hour:'numeric'}).replace(/[0-9]+ /g,'');

    format = format.replace(/%M/g,M);
    format = format.replace(/%m/g,m);
    format = format.replace(/%lm/g,lm);
    format = format.replace(/%sm/g,sm);
    format = format.replace(/%d/g,d);
    format = format.replace(/%D/g,D);
    format = format.replace(/%y/g,y);
    format = format.replace(/%h/g,h);
    format = format.replace(/%h1/g,h1);
    format = format.replace(/%H/g,H);
    format = format.replace(/%H1/g,H1);
    format = format.replace(/%i/g,i);
    format = format.replace(/%I/g,I);
    format = format.replace(/%s/g,s);
    format = format.replace(/%S/g,S);
    format = format.replace(/%a/g,a);
    return format;
}

class Axios{
    constructor(baseUrl,defHeaders) {
        this.baseUrl = baseUrl;
        this.defHeaders = defHeaders;
    }

    get(endpoint) {
        return axiosA({
            method:'get',
            url: endpoint
        });
    }
    

    toFormData(obj){
        var fd = new FormData();
        for(var i in obj){
            fd.append(i,obj[i]);
        }
        return fd;
    }

    async post(endpoint,headers=null,body=null,opts={}) {
        
        let params = {
            method:'post',
            url: this.baseUrl+endpoint
        };

        if (headers == 'default') params["headers"] = this.defHeaders
        else if (headers!=null) params["headers"] = headers;
        
        if (body!=null) params["data"] = this.toFormData(body);
        params = {...params,...opts};
        return axiosA(params);
    }

    
}

function elementLoad(selector) {
    return new Promise(resolve=>{
        var check = setInterval(function() {
            if (document.querySelector(selector) != null) {
                clearInterval(check);
                resolve(document.querySelector(selector));
            }
        }, 100);
    })
}

// COMP FUNCTIONS FOR ASYNCSTORAGE
const lStoreVals = ref({});
if(localStorage.getItem('async_locals') != null) lStoreVals.value = JSON.parse(localStorage.getItem('async_locals'));
window.onbeforeunload = ()=> localStorage.setItem('async_locals',JSON.stringify(lStoreVals.value));

export function watchLStore(key,func){
    watch(lStoreVals.value[key],func);
}

export const lStore = lStoreVals.value;
// END OF COMP FUNCTIONS FOR ASYNCSTORAGE

const apiURLs = {
    localhost: window.location.protocol+'//localhost/pw-bookingapp/api/',
    network: window.location.protocol+'//ns.proweaver.host/pw-bookingapp/api/',
    launched: window.location.protocol+'//'+window.location.hostname+'/pw-bookingapp/api/',
}

const axios = new Axios(apiURLs.network,{pwauth:'TWxBUUJPbUdPM1g5NDJxUm5Ncnp6UnlrZ2xRSlJyeXcvQ0RGNDVVYTRKMUprK0tPZjFrV3IrdHZrbkYvci9saGtQRGF5NnZmWEZveVl3TjNSYjVEUmc9PTo6OPee3c+XRvB5vpYEn0QVbg'});

function removeFix(object,fix) {
    let newObj = {};
    for (let k in object) {
        let key = k.toLowerCase().replaceAll(fix,""); 
        newObj[key] = object[k];
    }
    return newObj;
}

class PaypalIntegration{

    init(apikey,callback){
        const script = document.createElement("script");
        if(document.getElementById('paypalScript') != null) document.getElementById('paypalScript').remove();
        script.src = 'https://www.paypal.com/sdk/js?components=buttons&client-id='+apikey;
        script.id ="paypalScript";
        document.body.appendChild(script);
        script.addEventListener("load", callback(this)); 
    }

    mountOn(selector, value, currency_code="USD", description=''){
        return new Promise(async (res,rej)=>{
            await elementLoad(selector)
            

            if(document.querySelector(selector).innerHTML != '' ){
                res();    
                return;
            }


            const proceedTransaction = ()=> {
                window.paypal.Buttons({
                    createOrder: (data, actions) => {
                        if (value > 0) {
                            return actions.order.create({
                            purchase_units: [
                                {
                                    description:description,
                                    amount: {
                                        currency_code,
                                        value
                                    },
                                    payee: {
                                        email_address: 'kbaring4school@google.com'
                                    }
                                }
                            ]
                            });
                        } else {
                            alert(`The value should be more than 0`);
                            return;
                        }
                    },
                    onApprove: async () => {
                        res(true);
                    },
                    onError: err => {
                        rej(err);
                    }
                }).render(selector);
            }

            let interval = setInterval(()=>{
                if(window.paypal == null) return;
                if(document.querySelector(selector).children.length > 0){
                    clearInterval(interval);
                    return;
                }
                proceedTransaction();
                clearInterval(interval);
            },100)
            
        })
        
    }
}
const Paypal = new PaypalIntegration();



function delayExec(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function hexToHsl(H) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
      r = "0x" + H[1] + H[1];
      g = "0x" + H[2] + H[2];
      b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
      r = "0x" + H[1] + H[2];
      g = "0x" + H[3] + H[4];
      b = "0x" + H[5] + H[6];
    }
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
  
    if (delta == 0)
      h = 0;
    else if (cmax == r)
      h = ((g - b) / delta) % 6;
    else if (cmax == g)
      h = (b - r) / delta + 2;
    else
      h = (r - g) / delta + 4;
  
    h = Math.round(h * 60);
  
    if (h < 0)
      h += 360;
  
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
  
    return {h,s,l};
}
  
  
  
  
  

export{
    validateForm,
    dateFormat,
    formatDateString,
    axios,
    elementLoad,
    removeFix,
    Paypal,
    delayExec,
    hexToHsl
}