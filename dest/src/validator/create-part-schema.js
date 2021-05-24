import { part } from "../common/constants.js";
export default {
    name: function (value) { return typeof value === "string" && value.length > part.PART_NAME_MIN_LENGTH && value.length < part.PART_NAME_MAX_LENGTH; },
    price: function (value) { return typeof +value === "number" && value > part.PART_PRICE_MIN_VALUE && value < part.PART_PRICE_MAX_VALUE; },
    carSegmentId: function (value) { return typeof +value === "number" && value > part.CAR_SEGMENT_ID_MIN_VALUE; },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLXBhcnQtc2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3ZhbGlkYXRvci9jcmVhdGUtcGFydC1zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRTlDLGVBQWU7SUFDYixJQUFJLEVBQUUsVUFBQyxLQUFhLElBQUssT0FBQSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsb0JBQW9CLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsb0JBQW9CLEVBQWpILENBQWlIO0lBQzFJLEtBQUssRUFBRSxVQUFDLEtBQWEsSUFBSyxPQUFBLE9BQU8sQ0FBQyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsb0JBQW9CLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsRUFBcEcsQ0FBb0c7SUFDOUgsWUFBWSxFQUFFLFVBQUMsS0FBYSxJQUFLLE9BQUEsT0FBTyxDQUFDLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyx3QkFBd0IsRUFBbkUsQ0FBbUU7Q0FDckcsQ0FBQyJ9