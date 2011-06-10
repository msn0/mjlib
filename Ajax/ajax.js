if(typeof MJ === 'undefined'){
    MJ = {};
}

MJ.ajax = function(params){
    var worker = new Worker('ajax-worker.js');
    worker.postMessage({
        url: params.url,
        success: params.success,
        data: params.data
    });
    worker.onmessage = function(e){
        params.success(e.data);
        worker.terminate();
    };
};
