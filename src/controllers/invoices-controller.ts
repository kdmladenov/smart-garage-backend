import express, { Request, Response } from 'express';
// import { paging } from '../common/constants.js';
import authMiddleware from '../authentication/authMiddleware.js';
import loggedUserGuard from '../middleware/loggedUserGuard.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import rolesEnum from '../common/roles.enum.js';
import validateBody from '../middleware/validate-body.js';
import createVisitSchema from '../validator/create-visit-schema.js';
import updateVisitSchema from '../validator/update-visit-schema.js';
import errorHandler from '../middleware/errorHandler.js';
import invoicesService from '../services/invoices-services.js';
import visitsData from '../data/visits-data.js';
import errors from '../common/service-errors.js';
import invoicesData from '../data/invoices-data.js';
import partsData from '../data/parts-data.js';
import vehiclesData from '../data/vehicles-data.js';
import visitStatusEnum from '../common/visit-status.enum.js';

const invoicesController = express.Router();

invoicesController
  .get(
    '/',
    authMiddleware,
    loggedUserGuard,
    errorHandler(async (req: Request, res: Response) => {
      const { userId: loggedUserId, role } = req.user!;
      const { visitId, userId } = req.query;
      let { dateRangeLow, dateRangeHigh } = req.query;

      dateRangeLow = typeof dateRangeLow === 'string' ? dateRangeLow : '';
      dateRangeHigh = typeof dateRangeHigh === 'string' ? dateRangeHigh : '';
      const validatedUserId = userId ? +userId : 0;
      const validatedVisitId = visitId ? +visitId : 0;

      const { result, error } = await invoicesService.getAllInvoices(invoicesData)(validatedUserId, validatedVisitId, dateRangeLow, dateRangeHigh);

      if (error === errors.RECORD_NOT_FOUND) {
        return res.status(404).send({
          message: `Visit with id ${visitId} is not found.`,
        });
      }

      if (error === errors.OPERATION_NOT_PERMITTED) {
        return res.status(403).send({
          message: `This resource is forbidden!`,
        });
      }

      return res.status(200).send(result);
    }),
  );
export default invoicesController;