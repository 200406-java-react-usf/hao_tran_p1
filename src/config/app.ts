import { UserRepository } from "../repos/user-repo";
import { UserService } from "../services/user-service";
import { ReimbRepository } from "../repos/reimb-repo";
import { ReimbService } from "../services/reimb-service";

const userRepo = new UserRepository();
const userService = new UserService(userRepo);

const ReimbRepo = new ReimbRepository();
const ReimbService = new ReimbService(ReimbRepo);

export default {
    userService,
    reimbService
}