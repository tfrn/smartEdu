// hangi rolün ne yapabileceğine bakan middleware
module.exports = (roles) =>{ // işlemi gerçekleştirmeye yetkisi olan rolleri parametre ile aldık.
    return (req, res, next)=>{
        const userRole = req.body.role; // işlemi yapmaya çalışan kişinin rolünü parametre olarak aldık,
        if(roles.includes(userRole)){ // işlemi gerçekleştirebilecek rol ile kulanıcı rolü eşleşiyorsa, next() ile işlem gerçekleşsin dedik.
            next();
        }else{ // eşleşmiyorsa hata dönsün. 
            return res.status(401).send("you cant do it");
        }
    }
}

// mesela, sadece öğretmenler ve admin kurs açabilsin demek istiyorsak, courseroute'ta createcourse'ü şöyle düzenleriz;
// router.route('/').post(roleMiddleWare(["teacher", "admin"]), courseController.createCourse);  
// artık sadece öğretmen ve adminler yeni kurs oluşturabilir. 