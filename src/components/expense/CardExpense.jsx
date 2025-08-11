import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

function CardExpense({title, children}) {
    console.log(children)
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

export default CardExpense;
