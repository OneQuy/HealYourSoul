const { getDatabase, ref, set } = require('firebase/database')

var db = null;

function CheckAndInit() {    
    if (!db)
        db = getDatabase();
}


/**
 * @returns null if SUCCESS, error if error.
 */
async function FirebaseDatabase_SetValueAsync(relativePath, valueObject) {
    CheckAndInit();
    
    try
    {
        const reference = ref(db, relativePath);        
        await set(reference, valueObject);
        return null;
    }
    catch (err)
    {
        return err;
    }
}

module.exports = {
    FirebaseDatabase_SetValueAsync
}