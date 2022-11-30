const responseMessages = {
    signinSuccess:{
        message: "Signed In Successfully", 
        code: 201
    },

    signinFailed:{
        message: "Sign In Failed", 
        code: 202
    },

    emailRequired:{
        message: "Email id required", 
        code: 202
    },

    passwordRequired:{
        message: "Password required", 
        code: 202
    },

    insertSuccess:{
        message: "Insertion done", 
        code: 201
    },

    insertFailed:{
        message: "Insertion failed", 
        code: 202
    },

    getSpinnerZoneFailed:{
        message: "Zones Fatching failed", 
        code: 202
    },

    getSpinnerZoneSuccess:{
        message: "Zones Fatching Succeed", 
        code: 201
    },

    getTypeValFailed:{
        message: "Zone Value Fatching failed", 
        code: 202
    },

    getTypeValSuccess:{
        message: "Zone Value Fatching Succeed", 
        code: 201
    },

    getOrderIdError:{
        message: "Order ID Fatching failed", 
        code: 202
    },

    getOrderIdSuccess:{
        message: "Order ID Fatching Success", 
        code: 201
    },

    getZoneIdError:{
        message: "Zone ID Fatching failed", 
        code: 202
    },

    insertRecordError:{
        message: "Record insert failed", 
        code: 202
    },

    insertRecordSuccess:{
        message: "Record insert success", 
        code: 201
    },

    dataDoesNotExist:{
        message: "Record does not exist in database, please scan it again", 
        code: 202
    }

}
module.exports = responseMessages
