const userRepository = require('../repository/user.repository');
const baseResponse = require('../utils/baseResponse.util');
const bcrypt = require('bcrypt');

const saltRounds = 10;

exports.registerUser = async (req, res) => {
    try{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let emailValid = emailRegex.test(req.query.email);
        const passRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
        let passValid = passRegex.test(req.query.password);

        if(emailValid === false || passValid === false){
            baseResponse(res, false, 400, "Please Input a valid email, and Password must be 8 bit long, contain at least one number and one special character");
        } else {
            const hash = bcrypt.hashSync(req.query.password, saltRounds);
            const user = await userRepository.registerUser(req.query, hash);
            if(!user){
                baseResponse(res, false, 400, "Email already used");
            } else{
            baseResponse(res, true, 201, "User created", user);
            }
        }
    } catch(error){
        baseResponse(res, false, 500, "An error occurred while creating user", error);
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.query; // atau req.body jika POST JSON

        // Validasi input
        if (!email || !password) {
            return baseResponse(res, false, 400, "Please input email and password");
        }

        const user = await userRepository.loginUser({ email });

        if (!user) {
            return baseResponse(res, false, 400, "Invalid email or password");
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            return baseResponse(res, false, 400, "Invalid password");
        }

        return baseResponse(res, true, 200, "Login Success", user);
    } catch (error) {
        console.log(error);
        return baseResponse(res, false, 500, "An error occurred while logging in", error);
    }
};


exports.findUser = async (req, res) => {
    try{
        const user = await userRepository.findUser(req.params.email);
        if(!user){
            baseResponse(res, false, 404, "User not found");
        } else{
            baseResponse(res, true, 200, "User found", user);
        }
    } catch(error){
        baseResponse(res, false, 500, "An error occurred while fetching user", error);
    }
};

exports.updateUser = async (req, res) => {
    try{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let emailValid = emailRegex.test(req.body.email);
        const passRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
        let passValid = passRegex.test(req.body.password);

        if(emailValid === false || passValid === false){
            console.log(emailValid, passValid);
            baseResponse(res, false, 400, "Please Input a valid email, and Password must be 8 bit long, contain at least one number and one special character");
        } else{
            console.log("waiting hash")
            console.log(req.body.password)
            console.log(saltRounds)
            const hash = bcrypt.hashSync(req.body.password, saltRounds);
            console.log("waiting query")
            const user = await userRepository.updateUser(req.body, hash);
            if(!user){
                baseResponse(res, false, 404, "User not found");
            } else{
                baseResponse(res, true, 200, "User updated", user);
            }
        }
    }catch(error){
        baseResponse(res, false, 500, "An error occurred while updating user", error);
    }
};


exports.deleteUser = async (req, res) => {
    try{
        const user = await userRepository.deleteUser(req.params.id);
        if(!user){
            baseResponse(res, false, 404, "User not found");
        } else{
            baseResponse(res, true, 200, "User deleted", user);
        }
    }catch(error){
        baseResponse(res, false, 500, "An error occurred while deleting user", error);
    }
}

exports.topUp = async (req, res) => {
    try{
        if(req.query.amount < 0){
            baseResponse(res, false, 400, "Amount must be larger than 0");
        }else{
            const user = await userRepository.topUp(req.query.id, req.query.amount);
            if(!user){
                baseResponse(res, false, 404, "User not found");
            } else{
                baseResponse(res, true, 200, "Top Up Success", user);
            }
        }
    }catch(error){
        baseResponse(res, false, 500, "An error occurred while topping up", error);
    }
}