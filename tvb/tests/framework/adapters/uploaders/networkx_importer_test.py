# -*- coding: utf-8 -*-
#
#
# TheVirtualBrain-Framework Package. This package holds all Data Management, and
# Web-UI helpful to run brain-simulations. To use it, you also need do download
# TheVirtualBrain-Scientific Package (for simulators). See content of the
# documentation-folder for more details. See also http://www.thevirtualbrain.org
#
# (c) 2012-2013, Baycrest Centre for Geriatric Care ("Baycrest")
#
# This program is free software; you can redistribute it and/or modify it under
# the terms of the GNU General Public License version 2 as published by the Free
# Software Foundation. This program is distributed in the hope that it will be
# useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
# License for more details. You should have received a copy of the GNU General
# Public License along with this program; if not, you can download it here
# http://www.gnu.org/licenses/old-licenses/gpl-2.0
#
#
#   CITATION:
# When using The Virtual Brain for scientific publications, please cite it as follows:
#
#   Paula Sanz Leon, Stuart A. Knock, M. Marmaduke Woodman, Lia Domide,
#   Jochen Mersmann, Anthony R. McIntosh, Viktor Jirsa (2013)
#       The Virtual Brain: a simulator of primate brain network dynamics.
#   Frontiers in Neuroinformatics (7:10. doi: 10.3389/fninf.2013.00010)
#
#

"""
.. moduleauthor:: Lia Domide <lia.domide@codemart.ro>
"""

import os
import unittest
from tvb.tests.framework.core.base_testcase import TransactionalTestCase
from tvb.tests.framework.datatypes.datatypes_factory import DatatypesFactory
from tvb.core.adapters.abcadapter import ABCAdapter
from tvb.core.entities.file.files_helper import FilesHelper
from tvb.core.entities.storage import dao
from tvb.core.entities.transient.structure_entities import DataTypeMetaData
from tvb.core.services.flow_service import FlowService
from tvb.datatypes.connectivity import Connectivity


class NetworkxImporterTest(TransactionalTestCase):
    """
    Unit-tests for Obj Surface importer.
    """

    upload_file = os.path.join(os.path.dirname(__file__), "test_data", 'connectome_83.gpickle')


    def setUp(self):
        self.datatypeFactory = DatatypesFactory()
        self.test_project = self.datatypeFactory.get_project()
        self.test_user = self.datatypeFactory.get_user()


    def tearDown(self):
        FilesHelper().remove_project_structure(self.test_project.name)


    def test_import(self):

        count_before = self.count_all_entities(Connectivity)
        self.assertEqual(0, count_before)

        ### Retrieve Adapter instance
        group = dao.find_group('tvb.adapters.uploaders.networkx_importer', 'NetworkxConnectivityImporter')
        importer = ABCAdapter.build_adapter(group)

        args = {'data_file': self.upload_file,
                DataTypeMetaData.KEY_SUBJECT: "John"}

        ### Launch import Operation
        FlowService().fire_operation(importer, self.test_user, self.test_project.id, **args)

        count_after = self.count_all_entities(Connectivity)
        self.assertEqual(1, count_after)

        conn = self.get_all_entities(Connectivity)[0]
        self.assertEqual(83, conn.number_of_regions)



def suite():
    """
    Gather all the tests in a test suite.
    """
    test_suite = unittest.TestSuite()
    test_suite.addTest(unittest.makeSuite(NetworkxImporterTest))
    return test_suite


if __name__ == "__main__":
    #So you can run tests from this package individually.
    TEST_RUNNER = unittest.TextTestRunner()
    TEST_SUITE = suite()
    TEST_RUNNER.run(TEST_SUITE)
