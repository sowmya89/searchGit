//prototype object
jQuery.fn.getRepositories = function(username) {
    this.html("<span><h2>Loading " + username +"'s repositories...</span></h2>");
     
    var target = this;

    //XMLHttpRequest initialization
    var request = new XMLHttpRequest();
    request.open('get', 'https://api.github.com/users/'+username+'/repos', true);
    request.send();

    request.onreadystatechange=function(){
        if(request.readyState==4 && request.status==200){

        var repos = JSON.parse(this.responseText);//json parsing
        sortByName(repos);

        var list = $('<dl/>');
        target.empty().append(list);
        $(repos).each(function() {

            $("#avatar").attr("src",this.owner.avatar_url);
            $("#avatar").show();
            if (this.name != (username.toLowerCase()+'.github.com')) {
                list.append('<dt><h3><a href="'+ (this.homepage?this.homepage:this.html_url) +'">' + this.name + ' </a> <em>'+(this.language?('  (Language:'+this.language+')'):'')+'</em><input type="text" class="button" placeholder="Search this repository" onkeydown="search(this)"></h3> </dt>');
                list.append('<dd>' + this.description +'</dd>');
            }

        });
        }
        else{
            target.empty().append("<span><h5>Error! No user with username " + username +" exists.</span></h5>");
        }
    };  
};

function sortByName(repos) {
        repos.sort(function(a,b) {
        return a.name - b.name;
       });
    };

function searchRepo(username, repo, keyword){
    
    var modal = document.getElementById('myModal');
    var modalContent = document.getElementById('modalContent');
    var paraInfo = document.getElementById("paraInfo");
    if(paraInfo!= null){
        paraInfo.parentNode.removeChild(paraInfo);}
    

    var searchList = document.getElementById("searchList");
    if(searchList!=null){
        searchList.parentNode.removeChild(searchList); }

    var span = document.getElementsByClassName("close")[0];
    var celement = document.createElement("p");
    celement.setAttribute("id", "paraInfo");
    celement.innerHTML ='Searching GitHub repo' + repo +'for keyword'+keyword+'...';
    modalContent.appendChild(celement);

    modal.style.display = "block";
    span.onclick = function() {
    modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    //XMLHttpRequest initialization
    var request = new XMLHttpRequest();
    request.open('get', 'https://api.github.com/search/code?q='+keyword+'+in:file+repo:'+username+'/'+repo, true);
    request.send();

    request.onreadystatechange=function(){
      if(request.readyState==4 && request.status==200){
      var data = JSON.parse(this.responseText);
      console.log("data.items",data.items);

      var repoSearch = data.items; // JSON Parsing
      if (typeof repoSearch !== 'undefined' && repoSearch.length > 1) {
        // sortByName(repoSearch); 
        var list = $('<dl/>');
        list.attr('id', 'searchList');
        $('#modalContent').append(list);
        $('#paraInfo').text("The keyword was found in these files");

        $(repoSearch).each(function() {

            
            if (this.name !== (username.toLowerCase()+'.github.com') && 
                this.name !== "README.md" && 
                this.name !== ".project" && 
                this.name !== "build.gradle" && 
                this.name !== ".classpath" &&
                this.name !== ".cache") {
                list.append('<dt><h3><a href="'+ (this.homepage?this.homepage:this.html_url) +'">' + this.name + ' </a> </h3> </dt>');
                
            }

        });
       } else{
            $('#paraInfo').text("Sorry! No files with that keyword found.");
        }
      
        } 

    };


};



