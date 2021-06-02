import express, { Request, Response } from "express";
import servicesData from "../data/services-data.js";
import validateBody from "../middleware/validate-body.js";
import errors from "../common/service-errors.js";
import createServiceSchema from "../validator/create-service-schema.js";
import { service as SERVICE, paging } from "../common/constants.js";
import servicesServices from "../services/services-service.js";
import authMiddleware from "../authentication/authMiddleware.js";
import loggedUserGuard from "../middleware/loggedUserGuard.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import rolesEnum from "../common/roles.enum.js";
import updateServiceSchema from "../validator/update-service-schema.js";
import errorHandler from "../middleware/errorHandler.js";

const servicesController = express.Router();

servicesController
  // create service
  .post(
    "/",
    authMiddleware,
    loggedUserGuard,
    roleMiddleware(rolesEnum.employee),
    validateBody("service", createServiceSchema),
    errorHandler(async (req: Request, res: Response) => {
      const { name, price, carSegment } = req.body;

      const { error, service } = await servicesServices.createService(servicesData)(name, price, carSegment);

      if (error === errors.DUPLICATE_RECORD) {
        res.status(409).send({
          message: "A service with name already exists.",
        });
      } else {
        res.status(201).send(service);
      }
    }),
  )
  // get all services - search, sort, paging
  .get(
    "/",
    authMiddleware,
    loggedUserGuard,
    errorHandler(async (req: Request, res: Response) => {
      const { pageSize } = req.query;
      let {
        page = 1,
        priceLow = SERVICE.SERVICE_PRICE_MIN_VALUE,
        priceHigh = SERVICE.SERVICE_PRICE_MAX_VALUE,
        serviceName,
        carSegment,
      } = req.query;

      let validatedPageSize = paging.services.MIN_PAGE_SIZE;
      if (pageSize && typeof +pageSize === 'number' && +pageSize < paging.services.MIN_PAGE_SIZE) {
        validatedPageSize = paging.services.MIN_PAGE_SIZE;
      } else {
        validatedPageSize = 0;
      }
      page = page || 1;

      // pageSize = typeof pageSize === "number" ? pageSize : pageSize;
      serviceName = typeof serviceName === "string" ? serviceName : "";
      carSegment = typeof carSegment === "string" ? carSegment : "";
      priceLow = typeof priceLow === "number" ? priceLow : +priceLow || SERVICE.SERVICE_PRICE_MIN_VALUE;
      priceHigh = typeof priceHigh === "number" ? priceHigh : +priceHigh || SERVICE.SERVICE_PRICE_MAX_VALUE;

      const service = await servicesServices.getAllServices(servicesData)(
        +page,
        validatedPageSize,
        +priceLow,
        +priceHigh,
        serviceName,
        carSegment,
      );

      res.status(200).send(service);
    }),
  )

  // get by id
  .get(
    "/:serviceId",
    authMiddleware,
    loggedUserGuard,
    errorHandler(async (req: Request, res: Response) => {
      const { serviceId } = req.params;

      const { error, service } = await servicesServices.getServiceById(servicesData)(+serviceId);

      if (error === errors.RECORD_NOT_FOUND) {
        res.status(404).send({
          message: `A service with number ${serviceId} is not found!`,
        });
      } else {
        res.status(200).send(service);
      }
    }),
  )

  // update
  .put(
    "/:serviceId",
    authMiddleware,
    loggedUserGuard,
    roleMiddleware(rolesEnum.employee),
    validateBody("service", updateServiceSchema),
    errorHandler(async (req: Request, res: Response) => {
      const { serviceId } = req.params;
      const updatedServiceData = req.body;

      const { error, service } = await servicesServices.updateService(servicesData)(updatedServiceData, +serviceId);
      if (error === errors.RECORD_NOT_FOUND) {
        res.status(404).send({
          message: "The service is not found.",
        });
      } else {
        res.status(200).send(service);
      }
    }),
  )
  // delete service
  .delete(
    "/:serviceId",
    authMiddleware,
    loggedUserGuard,
    roleMiddleware(rolesEnum.employee),
    errorHandler(async (req: Request, res: Response) => {
      const { serviceId } = req.params;

      const { error, service } = await servicesServices.deleteService(servicesData)(+serviceId);

      if (error === errors.RECORD_NOT_FOUND) {
        res.status(404).send({
          message: `A service with id ${service} is not found!`,
        });
      } else {
        res.status(200).send(service);
      }
    }),
  );

export default servicesController;
