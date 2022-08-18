const express = require('express');
const router = express.Router();

//Models
const Book = require("../models/Book");

//EKLEME
router.get('/new', function(req, res, next) {
    const book = new Book(
        {
            title : "Kitap 12",
            userId : 3,
            category : "Story",
            comments : [
                {
                    message : "Çok iyi"
                },
                {
                    message: "Mutlaka okuyun"
                }
            ],
            meta : {
                votes : 150,
                favs : 25
            },
            published : true,
        }
    );
    book.save((err,data) => {
        if(err)
            console.log(err)
        else
            res.json(data);
    })
});

//ARAMA
router.get("/find" , (req,res) => {
    Book.find(
        {
            category : {
                $exists : true
            }
        }
    , "title published category" , (err,data) => {
        if(err)
            console.log("kayıtlar getirilemedi");
        else
            res.json(data);
    });
});
router.get("/findOne" , (req,res) => {
    Book.findOne( {title : "Kitap 10"} , "title published meta" , (err,data) => {
        if(err)
            console.log(err);
        else
            res.json(data);
    });
});
router.get("/findById" , (req,res) => {
    Book.findById( "5ec39a9f9d89750450b8c99f" , (err,data) => {
        if(err)
            console.log("kayıtlar getirilemedi");
        else
            res.json(data);
    });
});

//GÜNCELLEME
router.get("/update" , (req,res) => {
    Book.updateMany(
        {
            title : "Kitap 12"
        } ,
        {
            published : false
        } ,
        {
            multi : true,
            upsert : true
        } ,
        (err,data) => {
            if(err)
                console.log("kayıtlar getirilemedi");
            else
                res.json(data);
        });
});
router.get("/updateById" , (req,res) => {
    Book.findByIdAndUpdate(
        "5efe0baf2b805401d4bd69d2" ,
        {
            title : "Kitap XXX",
            "meta.favs" : 2
        },
        (err,data) => {
        if(err)
            console.log("kayıtlar getirilemedi");
        else
            res.json(data);
    });
});

//SİLME
/*
findOne() => remove()
findOneAndRemove()
remove()
 */
router.get("/remove" , (req,res) => {
    Book.findOne( {title : "Kitap E"} , (err,data) => {
        if(data===null)
            res.send("Kayıt Bulunamadı")
        else{
            data.remove((err,data) => {
                res.json(data);
            });
        }
    });
});
router.get("/findOneAndRemove" , (req,res) => {
    Book.findOneAndRemove( {title : "Kitap G" } , (err,data) =>{
            res.json(data);
    });
});
router.get("/removeAll" , (req,res) => {
    Book.remove({ published : true } , (err,data) =>{
        res.json(data);
    });
});

//SIRALAMA
router.get("/sort" , (req,res) => {
    Book.find({} , "title meta.favs" , (err,data) =>{
        res.json(data);
    }).sort({title : -1});
});

//LİMİT VE SKİP
router.get("/limitAndSkip" , (req,res) => {
    Book.find({} , "title meta.favs" , (err,data) =>{
        res.json(data);
    })
        .limit(2)
        .skip(3);
});

//AGGREGATE
/*
$match : kriterler
$group : alana göre sayma vs.
$project : neler gelsin
 */
router.get("/aggregate" , (req,res) => {
    Book.aggregate(
        [
            {
                $match : {
                    published:true
                }
            },
            /*{
                $group : {
                    _id : "$category",
                    toplam : {$sum : 1}
                }
            },*/
            {
                $project : {
                    title : true,
                    userId : true
                }
            },
            {
                $sort : {title : 1}
            },
            {
                $limit : 2
            },
            /*{
                $skip : 2
            }*/
        ] , (err,data) =>{
            res.json(data)
        });
});

//AGGREGATE $lookup
router.get("/aggregate-lookup" , (req,res) => {
    Book.aggregate(
        [
            {
                $lookup : {
                    from : 'users',
                    localField : 'userId',
                    foreignField : 'id',
                    as : 'user'
                }
            },
            {
                $unwind : '$user'
            },
            {
                $group : {
                    _id : {
                        username : "$user.fullName",
                    },
                    books : {
                        $push : "$title"
                    }
                }
            },
            {
                $project : {
                    _id : "$_id.username",
                    books : "$books"
                }
            }
        ], (err,data) => {
            res.json(data);
        });
});

module.exports = router;
