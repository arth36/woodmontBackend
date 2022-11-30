const responseMessages = require('../../constants/responseMessages')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const appController = {}
const moment = require('moment')

const sql = require('mssql')

// mysql connection
var config = {
    user: 'w.temp',
    password: '3699',
    server: 'UFACTORY03',
    database: 'UFactory',
    options: {
        trustServerCertificate: true
    }
};

sql.connect(config, function(err){
    if(err){
        console.log(err)
    }else{
        console.log('connected to the db!')
    }
})

maxage = 15 * 24 * 60 * 60

const createToken = function(id){
    return jwt.sign({id, isRefreshToken: false}, 'secret', {
        expiresIn: maxage
    })
}

appController.signin = async function(req, res){
    const request = new sql.Request();
    const {username, password} = req.body
    console.log(req.body)
    if(!username){
        res.status(responseMessages.emailRequired.code).json({
            message: responseMessages.emailRequired.message
        })
    }else if(!password){
        res.status(responseMessages.passwordRequired.code).json({
            message: responseMessages.passwordRequired.message
        })
    }else{
        request.query("SELECT * from Products.dbo.cor_user_temp where username = '" + username + "';", async function(err, response){
            if(err){
                res.status(responseMessages.signinFailed.code).json({
                    message: responseMessages.signinFailed.message
                })
            }else{
                if(!Object.keys(response.recordset).length){
                    console.log('hooooo')
                    res.status(responseMessages.signinFailed.code).json({
                        message: responseMessages.signinFailed.message
                    })
                }else{
                    const match = await bcrypt.compare(req.body.password, response.recordset[0].password)
                    if(match){
                        const token = createToken(response.recordset[0].id)
                        res.status(responseMessages.signinSuccess.code).json({
                            message: responseMessages.signinSuccess.message,
                            result: {
                                id: response.recordset[0].ID,
                                username: response.recordset[0].username,
                                token: token
                            }, 
                            status: responseMessages.signinSuccess.code
                        })
                    }else{
                        res.status(responseMessages.signinFailed.code).json({
                           message: responseMessages.signinFailed.message
                        })
                    }
                }
            }
        })
    }
}

appController.scanningProcess = async function(req, res){
    const request = new sql.Request();
    const {zoneid, scannedNumber, comments1, zoneuserid, companyid} = req.body
    const sales_order_id = parseInt(scannedNumber.slice(0, 6))
    const lime_item_seq_num = parseInt(scannedNumber.slice(6, 9))
    const package_num = parseInt(scannedNumber.slice(9, 14))

    request.query("insert into Products.dbo.man_zone_activity_temp (zone_id, sales_order_id, line_item_seq_num, package_num, comments1, scanned_number, zone_user_id, company_id) values (" + zoneid + "," + sales_order_id + "," + lime_item_seq_num + "," + package_num + ", '" + comments1 + "', '" + scannedNumber + "'," + zoneuserid + "," + companyid + ")", async function(err, response){
        if(err){
            console.log(err)
            res.status(responseMessages.insertFailed.code).json({
                message: responseMessages.insertFailed.message
            })
        }else{
            res.status(responseMessages.insertSuccess.code).json({
                message: responseMessages.insertSuccess.message
            })
        }
    })
}

appController.getSpinnerZones = async function(req, res){
    const request = new sql.Request();
    request.query("select * from TRACKING_ZONE where status = 'a'", async function(err, response){
        if(err){
            console.log(err)
            res.status(responseMessages.getSpinnerZoneFailed.code).json({
                message: responseMessages.getSpinnerZoneFailed.message
            })
        }else{
            res.status(responseMessages.getSpinnerZoneSuccess.code).json({
                message: responseMessages.getSpinnerZoneSuccess.message,
                zones: response.recordset
            })
        }
    })
}

appController.getTypeVal = async function(req, res){
    const request = new sql.Request();
    
    const {name} = req.body
    console.log(name)

    request.query("select insert_procedure_name, zone_id from TRACKING_ZONE where description = '" + name + "';", async function(err, response){
        if(err){
            res.status(responseMessages.getTypeValFailed.code).json({
                message: responseMessages.getTypeValFailed.message
            })
        }else{
            console.log(response.recordset)
            res.status(responseMessages.getTypeValSuccess.code).json({
                message: responseMessages.getTypeValSuccess.message,
                zonename: response.recordset[0].insert_procedure_name,
                zone_id: response.recordset[0].zone_id,
                status: responseMessages.getTypeValSuccess.code
            })
        }
    })
}

appController.insertScannedValue = async function(req, res){
    const request = new sql.Request();
    const {scannedValue, selectedType, zone_id, zoneuserid, comment1, comment2, comment3} = req.body
    console.log(selectedType)
    const pkgnum = scannedValue.slice(-5)
    const seqnum = scannedValue.substring(scannedValue.length - 8, scannedValue.length - 5)
    const ordnum = scannedValue.substring(0, scannedValue.length - 8)
    const companyid = '1'
    console.log(zoneuserid)

    const date = moment().format('YYYY-MM-DD HH:mm:ss')
    
    if(selectedType == 'order_activity'){
        console.log('Type1')
        request.query("select so.sales_order_id from sal_sales_order so, sal_sales_order_line_item li where so.sales_order_id = li.sales_order_id and so.sales_order_num = '" + ordnum + "' and li.seq_num = '" + seqnum + "'", async function(err, response){
            if(err){
                res.status(responseMessages.getOrderIdError.code).json({
                    message: responseMessages.getOrderIdError.message
                })
            }else{
                console.log(response.recordset[0])
                if(!Object.keys(response.recordset).length){
                    res.status(responseMessages.dataDoesNotExist.code).json({
                        message: responseMessages.dataDoesNotExist.message,
                        status: responseMessages.dataDoesNotExist.code
                    })
                }else{
                    const sal_ord_num = response.recordset[0].sales_order_id
                    request.query("insert into Products.dbo.man_zone_activity_temp (zone_id, sales_order_id, line_item_seq_num, package_num, comments1, scanned_number, zone_user_id, company_id, comments2, comments3) values (" + zone_id + "," + sal_ord_num + "," + seqnum + "," + pkgnum + ", '" + comment1 + "', '" + scannedValue + "'," + zoneuserid + "," + companyid + ", '" + comment2 + "','" + comment3 + "')", async function(err, response){
                        if(err){
                            console.log(err)
                            res.status(responseMessages.insertRecordError.code).json({
                                message: responseMessages.insertRecordError.message,
                                status: responseMessages.insertRecordError.code
                            })
                        }else{
                            res.status(responseMessages.insertRecordSuccess.code).json({
                                message: responseMessages.insertRecordSuccess.message,
                                status: responseMessages.insertRecordSuccess.code
                            })
                        }
                    })
                }
            }
        })
    }else{
        console.log('Type2')
        request.query("select so.sales_order_id from sal_sales_order so where so.sales_order_num = '" + scannedValue + "'", async function(err, response){
            if(err){
                console.log(err)
                res.status(responseMessages.getOrderIdError.code).json({
                    message: responseMessages.getOrderIdError.message,
                    status: responseMessages.getOrderIdError.code
                })
            }else{
                console.log("response", response)

                if(!Object.keys(response.recordset).length){
                    res.status(responseMessages.dataDoesNotExist.code).json({
                        message: responseMessages.dataDoesNotExist.message,
                        status: responseMessages.dataDoesNotExist.code
                    })
                }else{
                    const sal_ord_num = response.recordset[0].sales_order_id
                    request.query("insert into Products.dbo.man_zone_activity_temp (zone_id, sales_order_id, comments1, scanned_number, zone_user_id, company_id, comments2, comments3) values (" + zone_id + "," + sal_ord_num + ", '" + comment1 + "', '" + scannedValue + "'," + zoneuserid + "," + companyid + ", '" + comment2 + "','" + comment3 + "')", async function(err, response){
                        if(err){
                            console.log('hellllo', err)
                            res.status(responseMessages.insertRecordError.code).json({
                                message: responseMessages.insertRecordError.message,
                                status: responseMessages.insertRecordError.code
                            })
                        }else{
                            res.status(responseMessages.insertRecordSuccess.code).json({
                                message: responseMessages.insertRecordSuccess.message,
                                status: responseMessages.insertRecordSuccess.code
                            })
                        }
                    })
                }
            }
        })
    }
}

module.exports = appController;
