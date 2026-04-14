package com.skillevaluator.security;

import com.skillevaluator.model.PlanTier;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequiresPlan {
    PlanTier value() default PlanTier.PRO;
}
