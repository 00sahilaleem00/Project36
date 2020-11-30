class Food {
    constructor(){
        this.foodStock = 0;

        this.image1 = loadImage('images/Milk.png');
        this.image2 = loadImage('images/Milk Empty.png');
    }

    display(){
        var foodie = 0;

        database.ref('Food').on("value", function(data){
            foodie = data.val(); 
        });

        var x = 80, y = 100;
        imageMode(CENTER);
        if(foodie != 0){
            for(var i = 0; i < foodie; i++){
                if(i%10==0){
                    x = 80;
                    y += 50;
                }
                image(this.image1,x,y,50,50);
                x += 30;
            }
        }

        var x2 = 1000, y2 = 100;
        if(foodie!=5){
            for(var i = 0; i < 5-foodie; i++){
                if(i%10==0){
                    x2 = 1000;
                    y2 += 50;
                }
                image(this.image2,x2,y2,50,50);
                x2 -= 30;
            }

        }
    }

    updateFoodStock(data){
        database.ref('/').update({
            Food: data
        });
    }

    bedroom(){
        background(bedroomimg,550,500);
    }

    garden(){
        background(gardenimg,550,500);
    }

    washroom(){
        background(washroomimg,550,500);
    }

    livingroom(){
        background(livingroomimg,550,500);
    }
}