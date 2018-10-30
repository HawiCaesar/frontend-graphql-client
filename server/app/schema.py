import graphene
import graphene_django_optimizer as gql_optimizer  # noqa
from django.contrib.auth.models import User
from graphene import relay
from graphene_django.types import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField


from . import models


################################################################################
#
#  Apollo schema
#
################################################################################

class UserType(DjangoObjectType):
    class Meta:
        model = User


class StoreType(DjangoObjectType):
    class Meta:
        model = models.Store


class ProductType(DjangoObjectType):
    class Meta:
        model = models.Product


class OrderType(DjangoObjectType):
    class Meta:
        model = models.Order


class OrderItemType(DjangoObjectType):
    class Meta:
        model = models.OrderItem


class ApolloQuery(graphene.ObjectType):
    all_stores = graphene.List(StoreType)
    all_products = graphene.List(ProductType)
    all_orders = graphene.List(OrderType)
    all_order_items = graphene.List(OrderItemType)

    def resolve_all_stores(self, info):
        return gql_optimizer.query(models.Store.objects.all(), info)

    def resolve_all_products(self, info):
        return gql_optimizer.query(models.Product.objects.all(), info)

    def resolve_all_orders(self, info):
        return gql_optimizer.query(models.Order.objects.all(), info)

    def resolve_all_order_items(self, info):
        return gql_optimizer.query(models.OrderItem.objects.all(), info)


apollo_schema = graphene.Schema(query=ApolloQuery)


################################################################################
#
#  Relay schema
#
################################################################################

class UserNode(DjangoObjectType):
    class Meta:
        model = User
        exclude_fields = (
                'password',
                )
        filter_fields = {
                'first_name': ['contains'],
                }
        interfaces = (relay.Node,)


class StoreNode(DjangoObjectType):
    class Meta:
        model = models.Store
        filter_fields = {}
        interfaces = (relay.Node,)


class ProductNode(DjangoObjectType):
    class Meta:
        model = models.Product
        filter_fields = {
                'store': ['exact'],
                }
        interfaces = (relay.Node,)


class OrderNode(DjangoObjectType):
    class Meta:
        model = models.Order
        filter_fields = {}
        interfaces = (relay.Node,)


class OrderItemNode(DjangoObjectType):
    class Meta:
        model = models.OrderItem
        filter_fields = {}
        interfaces = (relay.Node,)


class Query(graphene.ObjectType):
    user = relay.Node.Field(UserNode)
    all_users = DjangoFilterConnectionField(UserNode)

    store = relay.Node.Field(StoreNode)
    all_stores = DjangoFilterConnectionField(StoreNode)

    product = relay.Node.Field(ProductNode)
    all_products = DjangoFilterConnectionField(ProductNode)

    order = relay.Node.Field(OrderNode)
    all_orders = DjangoFilterConnectionField(OrderNode)

    order_item = relay.Node.Field(OrderItemNode)
    all_order_items = DjangoFilterConnectionField(OrderItemNode)


relay_schema = graphene.Schema(query=Query)
