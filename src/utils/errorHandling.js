import { ENV_MODE } from "../../config/config.js";
let stackVar;

const asyncHandler = (API) => {
    return (req, res, next) => {
        API(req, res, next).catch(err => {

            stackVar = err.stack
            return next(new Error(err.message, { cause: 500 }))
        })
    }
}

const globalResponse = (err, req, res, next) => {
    if (err) {
        if (ENV_MODE == 'DEV') {
            return res
                .status(err['cause'] || 500)
                .json({ message: "Fail Response", Error: err.message, stack: stackVar })
        }
        return res
            .status(err['cause'] || 500)
            .json({ message: "Fail Response", Error: err.message  })

    }
}

export { asyncHandler, globalResponse }