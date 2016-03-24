window['idbtools'] =function(){

    var openDb = function(dbName, successFn) {
        if(!("indexedDB" in window)) {
            throw "error: indexedDB not supported."
        } else {
            var openRequest = indexedDB.open(dbName);

            openRequest.onsuccess = function(e) {
                successFn(e.target.result);
            };

            openRequest.onerror = function(e) {
                console.log("Error: could not open database");
            };
        }
    };


    var dumpStore = function(dbName, storeName, fields){
        if(!(fields)){
            throw "error: you must specify fields to dump";
        };

        var printRow = function(row){
            var values = [];
            for (var i = 0; i < fields.length; i++) {
                var field = fields[i];
                var value = JSON.stringify(row[field]);
                values.push(value);
            }
            console.log(values.join(","));
        };

        openDb(dbName, function(db){
            var transaction = db.transaction(storeName, "readonly");
            var objectStore = transaction.objectStore(storeName);
            var cursor = objectStore.openCursor();

            console.log(fields.join(","));

            cursor.onsuccess = function(e) {
                var cursor = e.target.result;
                if(cursor) {
                    printRow(cursor.value);
                    cursor.continue();
                }
            };

        });
    };

    var getValue = function(dbName, storeName, key) {
        openDb(dbName, function(db) {
            var transaction = db.transaction(storeName, "readonly");
            var objectStore = transaction.objectStore(storeName);
            var request = objectStore.get(key);

            request.onsuccess = function() {
                console.log(request.result);
            };
        });
    };

    var addValue = function(dbName, storeName, data){
        openDb(dbName, function(db) {
            var transaction = db.transaction(storeName, "readwrite");
            var objectStore = transaction.objectStore(storeName);
            var request = objectStore.add(data);

            request.onsuccess = function() {
                console.log("Saved datavalues");
            };

            request.onerror = function(e) {
              console.log(e);
            };
        });
    };

    return {
        dumpStore: dumpStore,
        getValue: getValue,
        addValue: addValue
    }
}.call(this);
