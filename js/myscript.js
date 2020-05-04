
var tasksData =(function() {
    var Task = function(task,id) {
        this.id = id
        this.work = task
    }
  
   
    return {
        items:
        {
            tasks:[],
            finishedTask:[]
        },
        numOfTask:0,
        numOfCompletedTask:0,
        totalRemainingTask:0,
        addTasks:function(inputs)
        {
            var id,newItem
            if(this.items.tasks.length>0) {
                id = this.items.tasks[this.items.tasks.length-1].id+1
            }
            else {
                id = 0
            }
            newItem = new Task( inputs.task,id )
            this.items["tasks"].push( newItem )
            return newItem

        },
        getTodoTasks:function()
        {
            return {
                task:this.items.tasks
            }
        },
        rmItemFromTodo:function(id) 
        {
            var Ids = this.items.tasks.map((item)=> {
                return item.id
            })
            var index = Ids.indexOf(id)
            var deletedItem = this.items.tasks.splice(index,1)
            this.items.finishedTask.push(deletedItem)
            return deletedItem

        },
        rmFromCompletedList:function(id) 
        {
            var i =  this.items.finishedTask.indexOf(id)
                this.items.finishedTask.splice(i,1)
         
        },
        calculateTotal:function(ar,item)
        {
            var sum = 0;
            ar.forEach((v,i)=> {
                i=i+1;
                sum=i
            
            })
            if(item ==="todo") {
                this.numOfTask = sum
            }
            else {
                this.numOfCompletedTask = sum
            }
        },
     

        getNumOfTotalTask:function()
         {
          this.calculateTotal(this.items.tasks,"todo")
          return this.numOfTask 
        },
        getNumOfCompletedTasks:function()
        {
            this.calculateTotal(this.items.finishedTask,"completed")
            return this.numOfCompletedTask
        },
        test:function()
        {
            return this.items  
        }   
    }

})()

var uiControl = (function() {

    var formatDate = function(date) 
    {
        date = date.toString()
        if( date.length == 1 ) {
            date = "".concat("0").concat(date)
            return date

        }
        return date
    }

    return{
        getInputs:function()
        {
            var task = document.querySelector(".add__description").value
            return {
                task:task
            }
        },
        clearFields:function()
        {
            document.querySelector('.add__description').value=""
        },
        addItem:function(task,taskstatus) 
        {
            var html,newhtml,element,btn;
            if(taskstatus==="todo") {
                btn =`<button class="add__btn"><i class="ion-ios-checkmark-outline"></i></button>`
                element = ".task__list"
                html = `<div class="item clearfix" id="todo-%id%">` 
            }
            else {
                btn = `<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>`
                element = ".Completed__list"
                html = `<div class="item clearfix" id="completedtask-%id%">`
            }
            html += `
                        <div class="item__description">%task%</div>
                        <div class="right clearfix">
                            <div class="item__delete">
                               ${btn}
                            </div>
                        </div>
                    </div>`
            newhtml = html.replace("%id%",task.id)
            newhtml = newhtml.replace("%task%",task.work)
            document.querySelector(element).insertAdjacentHTML("beforeend",newhtml)  
        },
        deleteItemFromUi:function(id) 
        {
            var element = document.getElementById(id)
            element.parentNode.removeChild(element)
        },
        updateUI:function(todoTask,completed)
        {
            document.querySelector('.header__task--value').textContent = todoTask
            document.querySelector('.header__Completed--value').textContent = completed
        },
        displayNameNDate:function(name)
        {
            var date = new Date()
            var year = date.getFullYear()
            var month = formatDate(date.getMonth())
            var day = formatDate(date.getDate())
            document.querySelector(".header__title--month").textContent = year+"/"+month+"/"+day
            if( name.length >= 1 ) {
            var temp = name
            name = name.substring(0,1).toUpperCase()+temp.substring(1,name.length)
            document.querySelector(".user_name").textContent = name+"\'s"
            }
        }
    }

})()

var controller = (function( ui,tasksD ) {
    var setEventListener = ()=>
    {
        document.querySelector('.add__btn').addEventListener("click",addItems)
        document.addEventListener('keypress',(e)=> {
            if(e.keyCode == 13 || e.which == 13) {
                addItems();
            }
        })
        document.querySelector('.container').addEventListener('click',deleteItem)

    }   

   var addItems = ()=>
   {
       var inputs =ui.getInputs()
       if( inputs.task!==null && isNaN(inputs.task) ) {
            //add into the data structure
            var item = tasksD.addTasks(inputs)
                //add into the UI
            ui.addItem(item,"todo")
            updateHeaderUI()
       }
       ui.clearFields()
    }
   var deleteItem = (event)=> 
   {
     var id = event.target.parentNode.parentNode.parentNode.parentNode.id
     if(id) {
            //delete from the data structure
            var split = id.split("-")
            var idToBeRemoved = parseInt(split[1])
            //remove from the ui
            ui.deleteItemFromUi(id)
            if( split[0] !== "completedtask" ) {
                var deletedItem = tasksD.rmItemFromTodo(idToBeRemoved)
                //add to the completed list
                ui.addItem(deletedItem[0],"completedtask")
            } 
            else {
                tasksD.rmFromCompletedList(idToBeRemoved) 
            }    
            updateHeaderUI()   
        }
    }
    var updateHeaderUI = function()
    {
      var todoTask = tasksD.getNumOfTotalTask()
      var completedtask = tasksD.getNumOfCompletedTasks()
      ui.updateUI(todoTask,completedtask)
    }

   return {
       init:function(){
           setEventListener()
           ui.updateUI(0,0)
           var name = prompt("Enter your name.")
           ui.displayNameNDate(name)
       }
   }
})(uiControl,tasksData)

controller.init()