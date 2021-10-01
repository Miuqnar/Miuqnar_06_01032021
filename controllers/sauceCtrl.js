const Sauce = require('../models/sauce');
const fs    = require('fs'); // pour supprimer les photo dans la base de donnée


exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.postObjectCreate = (req, res, next) => {
    const ctrlSauce = JSON.parse(req.body.sauce);
    delete ctrlSauce._id;
    const sauce = new Sauce ({
        name:         ctrlSauce.name,
        manufacturer: ctrlSauce.manufacturer,
        description:  ctrlSauce.description,
        mainPepper:   ctrlSauce.mainPepper,
        imageUrl:     `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        heat:         ctrlSauce.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        userId:        ctrlSauce.userId
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce created!' }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.updateSauce = (req, res) => {
    const upDateSauce = req.file ? 

    {...JSON.parse(req.body.sauce), imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`} : { ...req.body };

    Sauce.updateOne({ _id: req.params.id }, {...upDateSauce, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Object modified '}))
        .catch( error => res.status(400).json({ error }));

};

exports.deleteSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Object deleted '}))
              .catch(error => res.status(400).json({ error }));
          });
    })
    .catch(error => res.status(500).json({ error }));  
};


exports.likeSauceAndDislike = (req, res) => {
    const sauceId = req.params.id;
    const like    = req.body.like;
    const userId  = req.body.userId;

    if(like === 1 ){
        Sauce.updateOne({ _id: sauceId }, { $inc: { likes: 1}, $push: { usersLiked: userId }})
            .then(() => res.status(200).json({ message: 'sauce liked'}));

    }else if(like === -1) {
        Sauce.updateOne({ _id: sauceId }, { $inc: { dislikes: 1}, $push: { usersDisliked: userId }})
            .then(() => res.status(200).json({ message: "sauce didn't like"}))
            .catch(error => res.status(400).json({ error }));

    }else {
        Sauce.findOne({ _id: sauceId })
            .then(sauce => {
                if(sauce.usersLiked.includes(userId)){
                    Sauce.updateOne({ _id: sauceId }, { $inc: { likes: -1}, $pull: { usersLiked: userId}})
                        .then(() => res.status(200).json({ message: 'Neutral' }))
                        .catch( error => res.status(400).json({ error }));

                }else if(sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne({ _id: sauceId }, { $inc: {dislikes: -1}, $pull: { usersDisliked: userId}})
                        .then(() => res.status(200).json({ message: 'Neutral'}))
                        .catch(error => res.status(400).json({ error }));
                }
            })
    }
}




